var Tran  = require("../index");
var tran = new Tran({
	host: 'https://api.getui.com/apiex.htm', // http://sdk.open.api.igexin.com/apiex.htm
	appId: 'eECHDNfs5Z680lzQMEHCt6',
	appKey: 'CcArSfD8IrA7l8diZDxw46',
	masterSecret: 'VDLFyCWoyd9onOrmCP4m78',
	title: "智能家居信息"
});
tran.sendMessage("报警",{id:123456,alarm:2},'5c4e5cf583713aaa09543d5052f11f3e');