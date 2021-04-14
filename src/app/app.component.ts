import { Component, EventEmitter } from '@angular/core';
import {
  humanizeBytes,
  UploaderOptions,
  UploadFile,
  UploadInput,
  UploadOutput,
} from 'ngx-uploader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'angular-ngx-uploader-sample';

  options: UploaderOptions = {} as UploaderOptions;
  // ファイルアップロード時の制約を行いたい場合は、設定出来ます。
  // options: UploaderOptions = = { concurrency: 1, maxUploads: 3, maxFileSize: 100000000 } as UploaderOptions;

  // コンポーネント内で保持しているファイル情報です。
  // UploadOutputイベントの結果に応じて、ファイル情報を変動させる必要があります。
  files: UploadFile[] = [];

  uploadInput: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();
  humanizeBytes: Function = humanizeBytes;
  dragOver: boolean = false;

  private uploadInputEvent: UploadInput = {
    type: 'uploadAll',
    url: 'http://localhost:3000/upload',
    method: 'POST',
  };

  constructor() {}

  onUploadOutput(output: UploadOutput): void {
    switch (output.type) {
      case 'allAddedToQueue':
        // アップロード対象ファイルのキューにファイルを追加します。
        // 逐次、ファイルのアップロードを行う場合は、UploadInputイベントを発火します。
        // this.uploadInput.emit(this.uploadInputEvent);
        break;
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          this.files.push(output.file);
        }
        break;
      case 'uploading':
        // TODO デバッグ用の処理です。
        console.log(
          `${output.file?.name} : ${
            output.file?.progress.data?.percentage
          }% : ${humanizeBytes(output.file?.size ?? 0)}`
        );

        if (typeof output.file !== 'undefined') {
          // アップロード処理中のファイル情報を更新します。
          const index = this.files.findIndex(x => typeof output.file !== 'undefined' && x.id === output.file.id);
          this.files[index] = output.file;
        }
        break;
      case 'removed':
        // 対象のファイル情報を削除します。
        this.files = this.files.filter(x => x !== output.file);
        break;
      case 'dragOver':
        this.dragOver = true;
        break;
      case 'dragOut':
      case 'drop':
        this.dragOver = false;
        break;
      case 'done':
        break;
    }
  }

  onStartUpload(): void {
    this.startUpload();
  }

  /**
   * アップロード処理
   */
  startUpload(): void {
    // type: uploadAll の場合、キューに積まれたファイルを全てアップロードします。
    // NgUploaderService (ディレクティブで処理されている) で保持しているファイルキューに従って処理を行います。
    // (※) コンポーネント内で保持している変数とは別領域に保持しているので、注意！

    // 単一ファイルをアップロードする場合、fileに対象となるファイルを指定します。
    // const event: UploadInput = {
    //   type: 'uploadFile',
    //   url: 'http://localhost:3000/upload',
    //   method: 'POST',
    //   file: this.files[0]
    // };

    this.uploadInput.emit(this.uploadInputEvent);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
    this.files = this.files.filter((file: UploadFile) => file.id !== id);
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }
}
