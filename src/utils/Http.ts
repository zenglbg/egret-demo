class Http extends egret.Sprite {
  request: egret.HttpRequest;
  static http: Http;
  static get instance() {
    if (!this.http) {
      this.http = new Http();
    }
    return this.http;
  }

  public constructor() {
    super();
    this.init();
  }

  private init() {
    this.request = new egret.HttpRequest();
    this.request.responseType = egret.HttpResponseType.TEXT;
  }

  static formatParams(params: { [k: string]: any }) {
    return Object.keys(params).reduce((acc, key) => {
      const value = params[key];
      acc = /^\?{1}.*/g.test(acc)
        ? `${acc}&${key}=${value}`
        : `?${key}=${value}`;
      return acc;
    }, "");
  }

  static get(url: string, params: { [k: string]: any }) {
    return new Promise((resolve, reject) => {
      this.instance.request.open(
        url + this.formatParams(params),
        egret.HttpMethod.GET
      );
      this.instance.request.setRequestHeader(
        "Content-Type",
        "application/json"
      );
      this.instance.request.send();
      this.instance.request.addEventListener(
        egret.Event.COMPLETE,
        resolve,
        this
      );
      this.instance.request.addEventListener(
        egret.IOErrorEvent.IO_ERROR,
        (e: egret.IOErrorEvent) => {
          console.log("get error : " + e);
          reject(e);
        },
        this
      );
      this.instance.request.addEventListener(
        egret.ProgressEvent.PROGRESS,
        (e: egret.ProgressEvent) => {
          console.log(
            "get progress : " +
              Math.floor((100 * e.bytesLoaded) / e.bytesTotal) +
              "%"
          );
        },
        this
      );
    });
  }

  static post(url: string, body: { [k: string]: any }) {
    return new Promise((resolve, reject) => {
      this.instance.request.open(url, egret.HttpMethod.POST);
      this.instance.request.setRequestHeader(
        "Content-Type",
        "application/json"
      );
      this.instance.request.send(this.formatParams(body));
      this.instance.request.addEventListener(
        egret.Event.COMPLETE,
        resolve,
        this
      );
      this.instance.request.addEventListener(
        egret.IOErrorEvent.IO_ERROR,
        (e: egret.IOErrorEvent) => {
          console.log("get error : " + e);
          reject(e);
        },
        this
      );
      this.instance.request.addEventListener(
        egret.ProgressEvent.PROGRESS,
        (e: egret.ProgressEvent) => {
          console.log(
            "get progress : " +
              Math.floor((100 * e.bytesLoaded) / e.bytesTotal) +
              "%"
          );
        },
        this
      );
    });
  }

  /**
   * 登陆
   */
  static login(params) {
    return this.post("", params);
  }

  /**
   * 获取游戏结果
   * @param params
   */
  static getResult(params) {
    return this.post("", params);
  }
}
