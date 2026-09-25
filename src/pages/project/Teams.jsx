import { Link } from 'react-router-dom';

export default function Teams() {
    return (
        <main className="max-w-[1140px] mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8">TEAMS</h1>
            <section>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[
                        { name: 'AGIOTITA', image: '/2025/poster/Agiotita.webp', url: 'agiotita' },
                        { name: 'BIPOLAR', image: '/2025/poster/Bipolar.webp', url: 'bipolar' },
                        { name: '" - - - "', image: '/2025/poster/DASH.webp', url: 'dash' },
                        { name: 'Dialysis', image: '/2025/poster/Dialysis.webp', url: 'dialysis' },
                        { name: '표류[ ]기', image: '/2025/poster/표류기.webp', url: 'drift' },
                        { name: '자각몽', image: '/2025/poster/자각몽.webp', url: 'lucid-dream' },
                    ].map((team) => (
                        <Link
                            key={team.url}
                            to={`/team/${team.url}`}
                            className="block text-center hover:opacity-90 transition"
                        >
                            <img
                                src={team.image}
                                alt={team.name}
                                className="w-full aspect-square object-cover rounded-md shadow-md"
                            />
                            <p className="mt-2 text-lg font-medium text-black">{team.name}</p>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
