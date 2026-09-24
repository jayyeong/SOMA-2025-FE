"""Exercise deployment safety guards with fake AWS/curl commands (no network)."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

SCRIPT = Path(__file__).with_name('deploy.sh')

class DeploymentSafety(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / 'scripts').mkdir()
        (self.root / 'bin').mkdir()
        (self.root / 'build').mkdir()
        (self.root / 'build/index.html').write_text('fixture')
        shutil.copyfile(SCRIPT, self.root / 'scripts/deploy.sh')
        (self.root / 'scripts/verify-build.py').write_text('print("fixture verified")')
        (self.root / 'scripts/verify-photos.cjs').write_text('console.log("photo fixture verified")')
        aws = self.root / 'bin/aws'
        aws.write_text('''#!/usr/bin/env python3
import json,os,sys
with open(os.environ['CALL_LOG'],'a') as f: f.write(json.dumps(sys.argv[1:])+'\\n')
if sys.argv[1:3]==['sts','get-caller-identity']: print(os.environ.get('TEST_ACCOUNT','696592521871'))
if sys.argv[1:3]==['cloudfront','create-invalidation']: print('test-invalidation')
if os.environ.get('FAIL_UPLOAD')=='1' and sys.argv[1:3]==['s3','sync']: sys.exit(1)
''')
        aws.chmod(0o755)
        curl = self.root / 'bin/curl'
        curl.write_text('''#!/usr/bin/env python3
import pathlib,sys
pathlib.Path(sys.argv[sys.argv.index('-o')+1]).write_text('fixture')
''')
        curl.chmod(0o755)
        # Redirect only the verification scratch file into this fixture.
        p = self.root / 'scripts/deploy.sh'
        p.write_text(p.read_text().replace('/tmp/archive-2025-live.html', str(self.root / 'live.html')))
        self.env = dict(os.environ, PATH=str(self.root / 'bin')+os.pathsep+os.environ['PATH'], CALL_LOG=str(self.root/'calls'), GITHUB_REF='refs/heads/master', GITHUB_EVENT_NAME='workflow_dispatch', RELEASE_ID='123-1')

    def run_deploy(self, mode, **env):
        return subprocess.run(['bash',str(self.root/'scripts/deploy.sh'),mode],env=dict(self.env,**env),capture_output=True,text=True)

    def calls(self):
        return [json.loads(line) for line in (self.root/'calls').read_text().splitlines()] if (self.root/'calls').exists() else []

    def test_dry_run_never_writes(self):
        self.assertEqual(self.run_deploy('--dry-run').returncode,0)
        for call in self.calls():
            self.assertNotEqual(call[:2],['s3','cp'])
            self.assertNotEqual(call[0],'cloudfront')
            if call[:2]==['s3','sync']: self.assertIn('--dryrun',call)

    def test_wrong_account_stops(self):
        self.assertNotEqual(self.run_deploy('--deploy',TEST_ACCOUNT='000000000000').returncode,0)
        self.assertEqual(len(self.calls()),1)

    def test_branch_cannot_deploy(self):
        self.assertNotEqual(self.run_deploy('--deploy',GITHUB_REF='refs/heads/dev/test').returncode,0)
        self.assertEqual(len(self.calls()),0)

    def test_failed_asset_upload_preserves_entry_point(self):
        self.assertNotEqual(self.run_deploy('--deploy',FAIL_UPLOAD='1').returncode,0)
        self.assertFalse(any('build/index.html' in call for call in self.calls()))
        self.assertFalse(any(call[0]=='cloudfront' for call in self.calls()))

    def test_order_and_scope(self):
        self.assertEqual(self.run_deploy('--deploy').returncode,0)
        calls=self.calls()
        self.assertEqual([call[:2] for call in calls], [['sts','get-caller-identity'],['s3','cp'],['s3','sync'],['s3','cp'],['cloudfront','create-invalidation'],['cloudfront','wait']])
        self.assertIn('s3://kuadarchive-backup-696592521871/releases/2025/123-1/index.html',calls[1])
        self.assertIn('s3://kuadarchive/2025/',calls[2])
        self.assertNotIn('--delete',calls[2])
        self.assertIn('s3://kuadarchive/2025/index.html',calls[3])
        self.assertEqual(calls[4][calls[4].index('--paths')+1],'/2025/*')

if __name__=='__main__': unittest.main()
