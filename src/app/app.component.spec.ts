import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { UploadFile } from 'ngx-uploader';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
    }).compileComponents();
  });

  it('初期化出来ること。', () => {
    // Arrange
    const fixture = TestBed.createComponent(AppComponent);

    // Act
    const app = fixture.componentInstance;

    // Assert
    expect(app).toBeTruthy();
  });

  describe('onStartUpload', () => {
    it('正常実行出来ること。', () => {
      // Arrange
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      spyOn((app as any).uploadInput, 'emit');

      const uploadInputEvent = {
        type: 'uploadAll',
        url: 'http://localhost:3000/upload',
        method: 'POST',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: { 'Authorization': 'JWT token' },
      };

      // Act
      app.startUpload();

      // Assert
      expect((app as any).uploadInput.emit).toHaveBeenCalledWith(uploadInputEvent);
    });
  });

  describe('cancelUpload', () => {
    it('正常実行出来ること。', () => {
      // Arrange
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      spyOn((app as any).uploadInput, 'emit');

      const eventArgs = { type: 'cancel', id: "1" };

      // Act
      app.cancelUpload("1");

      // Assert
      expect((app as any).uploadInput.emit).toHaveBeenCalledWith(eventArgs);
    });
  });

  describe('removeFile', () => {
    it('正常実行出来ること。', () => {
      // Arrange
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      app.files.push({ id: "1" } as UploadFile);
      spyOn((app as any).uploadInput, 'emit');

      const eventArgs = { type: 'remove', id: "1" };

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
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      spyOn((app as any).uploadInput, 'emit');

      const eventArgs = { type: 'removeAll' };

      // Act
      app.removeAllFiles();

      // Assert
      expect((app as any).uploadInput.emit).toHaveBeenCalledWith(eventArgs);
    });
  });

});
