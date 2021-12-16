class SceneManager {
  private _stage: egret.DisplayObjectContainer; // 设置所有场景所在的舞台(根)
  private beginScene: BeginScene;
  private playScene: PlayScene;
  public constructor() {
    this.beginScene = new BeginScene();
    this.playScene = new PlayScene();
  }
  static sceneManager: SceneManager;
  static get instance() {
    if (!this.sceneManager) {
      this.sceneManager = new SceneManager();
    }
    return this.sceneManager;
  }

  static init(s: egret.DisplayObjectContainer) {
    SceneManager.instance._stage = s;
    const stage: egret.DisplayObjectContainer = this.instance._stage;
    const mScene = SceneManager.instance.beginScene;
    try {
      if (!mScene.parent) {
        stage.addChild(mScene);
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: SceneManager.ts ~ line 24 ~ SceneManager ~ init ~ error",
        error
      );
    }
  }

  private removeOther(scene) {
    const scenes = [this.beginScene, this.playScene];
    scenes.forEach((item) => {
      try {
        if (scene === item) {
          return;
        } else if (item["parent"]) {
          this._stage.removeChild(item);
        }
      } catch (error) {
        console.log(
          "🚀 ~ file: SceneManager.ts ~ line 32 ~ SceneManager ~ scenes.forEach ~ error",
          error
        );
      }
    });
  }

  static navigation(scene: "beginScene" | "playScene") {
    try {
      const _scene = this.instance[scene];
      this.instance.removeOther(_scene);
      _scene && this.instance._stage.addChild(_scene);
    } catch (error) {
      console.log(
        "🚀 ~ file: SceneManager.ts ~ line 55 ~ SceneManager ~ navigation ~ error",
        error
      );
    }
  }
}
