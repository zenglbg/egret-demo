enum IndentityType {
  BOMB,
  GIFT,
}
class Bomb extends egret.DisplayObjectContainer {
  public width: number;
  public height: number;
  public x: number;
  public y: number;
  public isUse: boolean = false;
  public model: egret.Bitmap;
  public btype: IndentityType;

  private _y = 50 + 300;
  private _speed = 15;
  private _main: PlayScene;

  public constructor(main: PlayScene, width = 50, height = 50) {
    super();
    this._main = main;
    this.width = width;
    this.height = height;
    this.y = this._y;
    this.drawMon();
  }

  private hitRect(b) {
    var a_min_x = this.x;
    var a_min_y = this.y;
    var a_max_x = this.x + this.width;
    var a_max_y = this.y + this.height;

    var b_min_x = b.x;
    var b_min_y = b.y;
    var b_max_x = b.x + b.width;
    var b_max_y = b.y + b.height;

    return (
      a_min_x <= b_max_x &&
      a_max_x >= b_min_x &&
      a_min_y <= b_max_y &&
      a_max_y >= b_min_y
    );
  }

  private frame() {
    const hit = this.hitRect(this._main.pigsFeet);
    if (hit) {
      this._main && this._main.removeChild(this);
      this.recycle();
      this._main.setState(this.btype);
    }
    if (this.isUse) {
      this.y += this._speed;
      if (this.y >= this.stage.stageHeight) {
        this._main && this._main.removeChild(this);
        this.recycle();
      }
    }
  }

  public recycle() {
    this.isUse = false;
    this.y = this._y;
    this.removeEventListener(egret.Event.ENTER_FRAME, this.frame, this);
  }

  public use(type: IndentityType, x: number, y: number = this._y) {
    this.btype = type;
    this.isUse = true;
    this.x = x;
    if (type === IndentityType.BOMB) {
      this.model.texture = RES.getRes("mon_png");
    } else {
      this.model.texture = RES.getRes("gift_png");
    }

    this.addEventListener(egret.Event.ENTER_FRAME, this.frame, this);
  }

  private drawMon() {
    this.model = new egret.Bitmap();
    this.addChild(this.model);
    this.model.anchorOffsetX = this.width / 2;
    this.model.anchorOffsetY = this.height / 2;
    const tw = egret.Tween.get(this.model, { loop: true });
    tw.to({ rotation: 360 }, 3000);
  }
}

class PlayScene extends eui.Component implements eui.UIComponent {
  public skinName: string = "resource/eui_skins/PlayScene.exml";
  
  private state = {
    total: 0,
  };
  private touter: number;
  private bombs: Array<Bomb> = [];
  public pigsFeet: eui.Image;
  //?????? ??????2????????????
  public offsetX: number;
  public offsetY: number;

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

  public setState(type: IndentityType) {
    if (type === IndentityType.BOMB) {
      this.state.total > 0 && this.state.total--;
    } else {
      this.state.total++;
    }
  }
  /**????????? */
  private init() {
    this.initPool();
    this.pigsFeetMove();
    this.goMon();
  }
  /**?????????????????? */
  private initPool() {
    for (let index = 0; index < 100; index++) {
      const bomb = new Bomb(this);
      this.bombs.push(bomb);
    }
  }

  /**??????????????????????????? */
  private getBomb(): Bomb {
    for (let index = 0; index < this.bombs.length; index++) {
      const element = this.bombs[index];
      if (element.isUse === false) {
        return element;
      }
    }
  }

  /**
   * ????????????????????????
   */
  private goMon() {
    this.touter && clearTimeout(this.touter);
    this.touter = setTimeout(() => {
      const x = Math.random() * (this.stage.stageWidth - 50 - 0 + 1) + 0;
      const bomb = this.getBomb();
      bomb &&
        bomb.use(
          Math.random() >= 0.5 ? IndentityType.GIFT : IndentityType.BOMB,
          x
        );
      bomb && this.addChild(bomb);
      this.goMon();
    }, Math.random() * 1000 * 1);
  }

  private onResult() {
    Http.getResult({}).then((res) => {});
  }

  /**??????????????????????????? */
  private pigsFeetMove() {
    this.pigsFeet.touchEnabled = true;
    this.pigsFeet.addEventListener(
      egret.TouchEvent.TOUCH_BEGIN,
      this.startMove,
      this
    );
    this.pigsFeet.addEventListener(
      egret.TouchEvent.TOUCH_END,
      this.stopMove,
      this
    );
  }
  private startMove(e: egret.TouchEvent): void {
    //??????????????????????????????
    this.offsetX = e.stageX - this.pigsFeet.x;
    this.offsetY = this.pigsFeet.y;
    // this.offsetY = e.stageY - this.pigsFeet.y;
    //???????????????????????????????????? onMove ??????
    // console.log("???????????????????????????????????? onMove ??????");
    this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
  }
  private stopMove() {
    // console.log("????????????????????????????????????????????????");
    this.stage.removeEventListener(
      egret.TouchEvent.TOUCH_MOVE,
      this.onMove,
      this
    );
  }
  private onMove(e: egret.TouchEvent) {
    // console.log(
    //   ` ?????????????????????????????????????????????????????????????????????????????????????????????????????????`
    // );
    this.pigsFeet.x = e.stageX - this.offsetX;
    // this.pigsFeet.y = e.stageY - this.offsetY;
    this.pigsFeet.y = this.offsetY;
  }
}
