<%
console.log("evio是" + evio + "<br />");

for (var i in iis) {
	console.log(i + ": " + (iis[i] ? "支持" : "不支持") + "<br />")
}

for (var i in statistics) {
	console.log(i + ": " + statistics[i] + "<br />")
}
%>

<div class="row">
    <div class="col-lg-3">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <span class="label label-success pull-right">月</span>
                <h5>收入</h5>
            </div>
            <div class="ibox-content">
                <h1 class="no-margins">40 886,200</h1>
                <div class="stat-percent font-bold text-success">98% <i class="fa fa-bolt"></i>
                </div>
                <small>总收入</small>
            </div>
        </div>
    </div>
    <div class="col-lg-3">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <span class="label label-info pull-right">全年</span>
                <h5>订单</h5>
            </div>
            <div class="ibox-content">
                <h1 class="no-margins">275,800</h1>
                <div class="stat-percent font-bold text-info">20% <i class="fa fa-level-up"></i>
                </div>
                <small>新订单</small>
            </div>
        </div>
    </div>
    <div class="col-lg-3">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <span class="label label-primary pull-right">今天</span>
                <h5>访客</h5>
            </div>
            <div class="ibox-content">
                <h1 class="no-margins">106,120</h1>
                <div class="stat-percent font-bold text-navy">44% <i class="fa fa-level-up"></i>
                </div>
                <small>新访客</small>
            </div>
        </div>
    </div>
    <div class="col-lg-3">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <span class="label label-danger pull-right">最近一个月</span>
                <h5>活跃用户</h5>
            </div>
            <div class="ibox-content">
                <h1 class="no-margins">80,600</h1>
                <div class="stat-percent font-bold text-danger">38% <i class="fa fa-level-down"></i>
                </div>
                <small>12月</small>
            </div>
        </div>
    </div>
</div>