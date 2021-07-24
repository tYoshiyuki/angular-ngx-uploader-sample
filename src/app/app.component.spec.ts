import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { UploadFile, UploadInput, UploadOutput } from 'ngx-uploader';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
    }).compileComponents();
  });

  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('初期化出来ること。', () => {
    // Assert
    expect(app).toBeTruthy();
  });

  describe('onStartUpload', () => {
    it('正常実行出来ること。', () => {
      // Arrange
      spyOn((app as any).uploadInput, 'emit');

      const uploadInputEvent = {
        type: 'uploadAll',
        url: 'http://localhost:3000/upload',
        method: 'POST',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: { 'Authorization': 'JWT token' },
      } as UploadInput;

      // Act
      app.startUpload();

      // Assert
      expect((app as any).uploadInput.emit).toHaveBeenCalledWith(uploadInputEvent);
    });
  });

  describe('cancelUpload', () => {
    it('正常実行出来ること。', () => {
      // Arrange
      spyOn((app as any).uploadInput, 'emit');

      const eventArgs = { type: 'cancel', id: "1" } as UploadInput;

      // Act
      app.cancelUpload("1");

      // Assert
      expect((app as any).uploadInput.emit).toHaveBeenCalledWith(eventArgs);
    });
  });

  describe('removeFile', () => {
    it('正常実行出来ること。', () => {
      // Arrange
      app.files.push({ id: "1" } as UploadFile);
      spyOn((app as any).uploadInput, 'emit');

      const eventArgs = { type: 'remove', id: "1" } as UploadInput;

      // Act
      app.removeFile("1");

      // Assert
      expect((app as any).uploadInput.emit).toHaveBeenCalledWith(eventArgs);
      expect(app.files.length).toBe(0);
    });
  });

  describe('removeAllFiles', () => {
    it('正常実行出来ること。', () => {
      // Arrange
      spyOn((app as any).uploadInput, 'emit');
      const eventArgs = { type: 'removeAll' } as UploadInput;

      // Act
      app.removeAllFiles();

      // Assert
      expect((app as any).uploadInput.emit).toHaveBeenCalledWith(eventArgs);
    });
  });

  describe('onUploadOutput', () => {
    // @todo allAddedToQueue
    // @todo removed
    // @todo dragOver
    // @todo dragOut
    // @todo drop
    // @todo done

    describe('addedToQueue', () => {
      it('正常実行出来ること。', () => {
        // Arrange
        const eventArgs = {
          type: 'addedToQueue',
          file: {
            id: "1"
          }
        } as UploadOutput;

        // Act
        app.onUploadOutput(eventArgs);

        // Assert
        expect(app.files.length).toBe(1);
      });
    });

    describe('uploading', () => {
      it('正常実行出来ること。', () => {
        // Arrange
        app.files.push({ id: "1", size: 0 } as UploadFile);

        const eventArgs = {
          type: 'uploading',
          file: {
            id: "1",
            size: 100,
            progress: {
              data: {
                percentage: 10
              }
            }
          }
        } as UploadOutput;

        // Act
        app.onUploadOutput(eventArgs);

        // Assert
        expect(app.files.length).toBe(1);
        expect(app.files[0].size).toBe(100);
        expect(app.files[0].progress.data?.percentage).toBe(10);
      });
    });
  });
});
