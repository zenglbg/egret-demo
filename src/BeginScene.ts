class BgContent extends egret.DisplayObjectContainer {
  public constructor() {
    super();

    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.init, this);
  }

  private init() {
    const shp: egret.Shape = new egret.Shape();
    shp.graphics.beginFill(0x000000, 1);
    shp.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
    shp.graphics.endFill();
    this.addChild(shp);
  }
}

class BeginScene extends eui.Component implements eui.UIComponent {
  public constructor() {
    super();

    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.init, this);
  }

  protected partAdded(partName: string, instance: any): void {
    super.partAdded(partName, instance);
  }

  protected childrenCreated(): void {
    super.childrenCreated();
  }

  public init() {
    const bg = new BgContent();
    bg.name = "bg";
    this.addChildAt(bg, 0);
    this.createText();
  }

  public createText() {
    const begin = new egret.TextField();
    begin.text = "click begin";
    begin.size = 50;
    this.addChild(begin);
    begin.x = (this.stage.stageWidth - begin.width) / 2;
    begin.y = this.stage.stageHeight / 2;
	begin.touchEnabled = true
    begin.addEventListener(
      egret.TouchEvent.TOUCH_TAP,
      () => {
        console.log("前往游戏");
        SceneManager.navigation("playScene");
      },
      this
    );
  }
}
