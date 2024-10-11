import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as musicMetadata from 'music-metadata';

const prisma = new PrismaClient();
import { v4 as uuidv4 } from 'uuid';

async function addSampleData() {
    const sampleDataDir = path.join(__dirname, '../../sample_data');
    const artistDirs = fs.readdirSync(sampleDataDir);

    for (const artistDir of artistDirs) {
        const artistPath = path.join(sampleDataDir, artistDir);
        const descriptionPath = path.join(artistPath, 'description.txt');
        const imagePath = path.join(artistPath, 'image.jpg');

        if (fs.existsSync(descriptionPath) && fs.existsSync(imagePath)) {
            const profile = fs.readFileSync(descriptionPath, 'utf-8');
            const image = fs.readFileSync(imagePath);

            const staticDir = path.join(__dirname, '../../static/uploads');
            if (!fs.existsSync(staticDir)) {
                fs.mkdirSync(staticDir, { recursive: true });
            }

            const staticImagePath = path.join('static/uploads', `${path.basename(imagePath)}`);
            fs.writeFileSync(path.join(__dirname, '../../', staticImagePath), image);

            const artist = await prisma.artist.create({
                data: {
                    name: artistDir,
                    profile: profile,
                    image: `/${staticImagePath.replace('static/', '')}`,
                },
            });

            const songsDir = path.join(artistPath, 'songs');
            if (fs.existsSync(songsDir)) {
                const songFiles = fs.readdirSync(songsDir);
                for (const songFile of songFiles) {
                    const songPath = path.join(songsDir, songFile);
                    
                    // 音声ファイルのみを処理するためのフィルタリング
                    if (path.extname(songFile).toLowerCase() !== '.mp3' && path.extname(songFile).toLowerCase() !== '.wav') {
                        continue; // サポートされていないファイルタイプはスキップ
                    }

                    const songTitle = path.basename(songFile, path.extname(songFile));
                    const songImagePath = path.join(songsDir, `${songTitle}.jpg`);
                    const audio = fs.readFileSync(songPath);
                    const audioPath = path.join('static/uploads', `${path.basename(songPath)}`);
                    fs.writeFileSync(path.join(__dirname, '../../', audioPath), audio);
                    const songImage = fs.readFileSync(songImagePath);
                    const staticSongImagePath = path.join('static/uploads', `${path.basename(songImagePath)}`);
                    fs.writeFileSync(path.join(__dirname, '../../', staticSongImagePath), songImage);
                    const getAudioDuration = async (filePath: string): Promise<number> => {
                        try {
                            const buffer = fs.readFileSync(filePath);
                            const metadata = await musicMetadata.parseBuffer(buffer);
                            return metadata.format.duration || 0;
                        } catch (error) {
                            console.error('Error reading audio duration:', error);
                            return 0;
                        }
                    };

                    const duration = await getAudioDuration(path.join(__dirname, '../../', audioPath));

                    const song = await prisma.song.create({
                        data: {
                            title: songTitle,
                            artistId: artist.id,
                            image: `/${staticSongImagePath.replace('static/', '')}`,
                            audio: `/${audioPath.replace('static/', '')}`,
                            duration: duration,
                        },
                    });
                }
            }
        }
    }
}

addSampleData().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
