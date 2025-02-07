console.log('start deploy-to-cf');

const backupFileList: string[] = [
    'src/lib/server/updateArtist.ts',
    'src/lib/server/addArtist.ts',
    'src/lib/server/updateSong.ts',
    'src/lib/server/addSong.ts',
];

import fs from 'fs';
import path from 'path';

const backupDir = 'ts_bk';

// ts_bkディレクトリが存在するか確認
if (fs.existsSync(backupDir)) {
    throw new Error('ts_bk directory already exists. Please remove it before proceeding.');
}

// ts_bkディレクトリを作成
fs.mkdirSync(backupDir);

// ファイルをts_bkに退避し、元ファイルをコメントアウト
backupFileList.forEach((filePath) => {
    const fileName = path.basename(filePath);
    const backupFilePath = path.join(backupDir, fileName);
    console.log(`copy ${filePath} to ${backupFilePath}`);

    // ファイルをコピー
    fs.copyFileSync(filePath, backupFilePath);

    // 元ファイルの内容を読み込み
    let fileContent = fs.readFileSync(filePath, 'utf-8');

    // import fsとimport pathをコメントアウト
    fileContent = fileContent.replace(/import fs from 'fs';/g, '// import fs from \'fs\';');
    fileContent = fileContent.replace(/import path from 'path';/g, '// import path from \'path\';');

    // path.とfs.の行をコメントアウト
    fileContent = fileContent.split('\n').map(line => {
        if (line.includes('path.') || line.includes('fs.')) {
            return `// ${line}`;
        }
        return line;
    }).join('\n');

    // 元ファイルの内容を更新
    fs.writeFileSync(filePath, fileContent);
});

