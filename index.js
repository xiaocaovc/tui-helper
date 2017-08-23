/**
 * Created by Center on 2017-05-05.
 */
var GeTui = require('./GT.push');
var Target = require('./getui/Target');

var APNTemplate = require('./getui/template/APNTemplate');
var BaseTemplate = require('./getui/template/BaseTemplate');
var APNPayload = require('./payload/APNPayload');
var DictionaryAlertMsg = require('./payload/DictionaryAlertMsg');
var SimpleAlertMsg = require('./payload/SimpleAlertMsg');
var NotyPopLoadTemplate = require('./getui/template/NotyPopLoadTemplate');
var LinkTemplate = require('./getui/template/LinkTemplate');
var NotificationTemplate = require('./getui/template/NotificationTemplate');
var PopupTransmissionTemplate = require('./getui/template/PopupTransmissionTemplate');
var TransmissionTemplate = require('./getui/template/TransmissionTemplate');

var SingleMessage = require('./getui/message/SingleMessage');
var AppMessage = require('./getui/message/AppMessage');
var ListMessage = require('./getui/message/ListMessage');
const _ = require('lodash');

const defaultOptions = {
	host: 'https://api.getui.com/apiex.htm',
	appId: 'eECHDNfs5Z680lzQMEHCt6',
	appKey: 'CcArSfD8IrA7l8diZDxw46',
	masterSecret: 'VDLFyCWoyd9onOrmCP4m78',
	title: "智能家居信息"
};
function tran(options) {
	// http的域名
	this.options = _.assign({}, defaultOptions, options);
	this.gt = new GeTui(this.options.host, this.options.appKey, this.options.masterSecret);
}
tran.prototype ={
	setConfig:function (host,appId,appKey,masterSecret,title) {
		this.host =host;
		this.appId = appId;
		this.appKey = appKey;
		this.masterSecret = masterSecret;
		this.title = title;
		this.gt =  new GeTui(this.host, this.appKey, this.masterSecret);
	},
	sendMessage:function (title,info,cId) {
		var template =  new TransmissionTemplate({
			appId: this.appId,
			appKey: this.appKey,
			transmissionType: 1,
			transmissionContent: JSON.stringify(info)
		});
		//APN高级推送
		var payload = new APNPayload();
		var alertMsg = new DictionaryAlertMsg();
		alertMsg.body = JSON.stringify(info);
		alertMsg.actionLocKey = "actionLocKey";
		alertMsg.locKey = title; // locKey
		alertMsg.locArgs = Array("locArgs");
		alertMsg.launchImage = "launchImage";
		//ios8.2以上版本支持
		alertMsg.title = "警报信息";
		alertMsg.titleLocKey = this.title; // titleLocKey
		alertMsg.titleLocArgs = Array("titleLocArgs");
		payload.alertMsg=alertMsg;
		template.setApnInfo(payload);
		//个推信息体
		var message = new SingleMessage({
			isOffline: true,                        //是否离线
			offlineExpireTime: 3600 * 12 * 1000,    //离线时间
			data: template,                          //设置推送消息类型
			pushNetWorkType:0                     //是否wifi ，0不限，1wifi
		});
		//接收方
		var target = new Target({
			appId: this.appId,
			clientId: cId
		});
		var that = this;
		this.gt.pushMessageToSingle(message, target, function(err, res){
			console.log(res);
			if(err != null && err.exception != null && err.exception instanceof  RequestError){
				var requestId = err.exception.requestId;
				console.log(err.exception.requestId);
				that.gt.pushMessageToSingle(message,target,requestId,function(err, res){
					console.log(err);
					console.log(res);
				});
			}
		});
	}
};
module.exports = tran;