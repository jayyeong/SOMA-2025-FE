import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const videoList = [
    {
        title: 'MAIN TEASER',
        src: '/videos/MainTeaser.mp4'
    },
    {
        title: 'AGIOTITA',
        src: '/videos/team_1_cut_comp.mp4'
    },
    {
        title: 'BIPOLAR',
        src: '/videos/team_2_cut_2560.mp4'
    },
    {
        title: '" - - - "',
        src: '/videos/team_3_cut_comp.mp4'
    },
    {
        title: 'Dialysis',
        src: '/videos/team_4_cut_comp.mp4'
    },
    {
        title: '표류[ ]기',
        src: '/videos/team_5_cut_comp.mp4'
    },
    {
        title: '자각몽',
        src: '/videos/team_6_cut_comp.mp4'
    },
];

const teamTitleToIdMap = {
    AGIOTITA: 'agiotita',
    BIPOLAR: 'bipolar',
    '" - - - "': 'dash',
    Dialysis: 'dialysis',
    '표류[ ]기': 'drift',
    자각몽: 'lucid-dream'
};

const Home = () => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();
    const goToVideo = (index) => {
        setProgress(0);
        setCurrentIndex(index);
    };

    const handlePrev = () => {
        goToVideo((prev) => (prev === 0 ? videoList.length - 1 : prev - 1));
    };

    const handleNext = () => {
        goToVideo((prev) => (prev === videoList.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className='bg-black'>
            <div
                className="
                bg-black
                relative
                h-[calc(100dvh-52px-64px)]  
                lg:h-[calc(100dvh-190px-64px)]
                flex items-center justify-center
        "
            > {/* 헤더 푸터 길이만큼 빼 */}

                <video
                    key={currentIndex} // 인덱스 변경 시마다 새로 로드
                    src={`${process.env.PUBLIC_URL}${videoList[currentIndex].src}`}
                    autoPlay
                    muted
                    loop={false}
                    playsInline
                    onEnded={handleNext}
                    onTimeUpdate={({ currentTarget: video }) => {
                        setProgress(Number.isFinite(video.duration) && video.duration > 0
                            ? video.currentTime / video.duration * 100 : 0);
                    }}
                    onClick={() => {
                        const title = videoList[currentIndex].title;
                        const teamId = teamTitleToIdMap[title];
                        if (teamId) {
                            navigate(`/team/${teamId}`);
                        }
                    }}
                    className="w-full h-full object-cover"

                />

                {/* 진행 바 */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                    <div
                        className="h-full bg-black"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* 좌우 버튼 */}
                <div className="hidden lg:flex">
                    <button
                        aria-label="이전 영상" onClick={handlePrev}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl z-10"
                    >
                        &#10094;
                    </button>
                    <button
                        aria-label="다음 영상" onClick={handleNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl z-10"
                    >
                        &#10095;
                    </button>
                </div>
            </div>

            {/* 하단 메뉴 패널 */}
            <div className="hidden lg:flex bg-white w-full flex justify-center border-t border-gray-200">
                {videoList.map((video, index) => (
                    <button
                        key={index}
                        onClick={() => goToVideo(index)}
                        className={`
              py-4 px-6 text-lg font-medium relative transition-colors
              ${index === currentIndex ? 'text-black' : 'text-gray-400'}
            `}
                    >
                        {video.title}
                        {index === currentIndex && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
                        )}
                    </button>
                ))}
            </div>


            {/* 하단 메뉴 패널(모바일) */}
            <div className="lg:hidden absolute bottom-0 left-0 w-full bg-white flex items-center justify-between px-4 py-3 z-20">
                <button
                    aria-label="이전 영상" onClick={handlePrev}
                    className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full text-xl"
                >
                    &#10094;
                </button>

                <div className="flex flex-col items-center">
                    <span className="text-base font-semibold">{videoList[currentIndex].title}</span>
                </div>

                <button
                    aria-label="다음 영상" onClick={handleNext}
                    className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full text-xl"
                >
                    &#10095;
                </button>
            </div>
        </div>
    );
};

export default Home;