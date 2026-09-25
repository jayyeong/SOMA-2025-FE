import React from 'react';
const MainTheme = () => {
    return (
        <div className="max-w-[1140px] mx-auto px-4 py-10 space-y-20">
            {/* 1. 메인포스터 + 설명 */}
            <section className="flex flex-col md:flex-row items-center gap-10">
                <img
                    src="/2025/poster/SOMA2025poster.webp"
                    alt="Main Poster"
                    className="w-full md:w-1/2 rounded-lg"
                />
                <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-5xl font-bold mb-4">SOMA</h2>
                    <p className="text-lg leading-relaxed">
                        SOMA는 체세포, 더 나아가 물리적 형태인 몸과 정신이 깃든 신체를 아우르는 개념이다.
                        신체는 타고난 본성으로부터 시작하여, 나로 비롯된 취향, 그리고 자연스럽게 형성된 습관을 통해 하나의 고유한 실체로 완성되어 간다.<br /><br />

                        우리는 이번 쇼에서 의식하지 않아도 완성되는 개인의 - SOMA를 담았다.
                        이는 단순한 패션쇼를 넘어 신체와 감각의 경계를 탐구하는 예술적 실험이자, 인간의 본질에 대한 깊은 질문을 던지는 무대다.<br /><br />

                        2025 SOMA를 통해 관객이 자신의 감각 세계를 확장하고, 신체를 매개로 한 새로운 이야기를 발견할 수 있기를 바란다.
                    </p>
                </div>
            </section>

            {/* 2. 티저 영상 */}
            <section className="text-center">
                <div className="w-full max-w-[1140px] mx-auto aspect-video">
                    <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/jO-DC4w7Gr8"
                        title="SOMA Teaser"
                        frameBorder="0"
                        allowFullScreen
                    />
                </div>
                <h3 className="text-xl font-semibold mt-4">SOMA TEASER</h3>
            </section>



        </div>
    );
};

export default MainTheme;
