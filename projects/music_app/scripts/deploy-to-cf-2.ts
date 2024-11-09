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

// ts_bkディレクトリが存在しない場合はエラーをスロー
if (!fs.existsSync(backupDir)) {
    throw new Error('ts_bk directory does not exist. Please create it before proceeding.');
}

// 既存のファイルを削除し、ts_bkから戻す
backupFileList.forEach((filePath) => {
    const fileName = path.basename(filePath);
    const backupFilePath = path.join(backupDir, fileName);

    // // 既存のファイルを削除
    // if (fs.existsSync(filePath)) {
    //     fs.unlinkSync(filePath);
    // }

    // ts_bkからファイルを戻す
    fs.copyFileSync(backupFilePath, filePath);
    // ts_bkのディレクトリごと削除
});
