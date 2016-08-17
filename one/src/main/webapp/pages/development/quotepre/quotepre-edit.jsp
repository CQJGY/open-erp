<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="../../base/path.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>预报价</title>
    <jsp:include page="../../base/hb-headc.jsp"></jsp:include>
    <jsp:include page="../../base/upload.jsp"></jsp:include>
    <link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/ace.css" class="ace-main-stylesheet"       id="main-ace-style"/>
</head>
<body>
<div class="breadcrumbs" id="breadcrumbs">
    <ol class="breadcrumb">
        <li><a href="#">开发</a></li>
        <li><a href="#">预报价</a></li>
        <li class="active">新增/修改</li>
    </ol>
</div>
<div class="page-content">
    <!-- PAGE CONTENT BEGINS -->
    <div class="row">
        <div class="col-xs-12">
            <form class="form-horizontal" role="form" id="quotepreForm">
                <div id="quotepreDesc">
                    <div id="quotepreDescTitle">
                        <h5 class="header smaller lighter blue">
                            报价信息
                            <small></small>
                            <input type="hidden" name="natrualkey" id="natrualkey" value="${natrualkey}"/>
                            <input type="hidden" name="approveStatus" id="approveStatus" value="${quotedInfo.approveStatus}"/>
                            <input type="hidden" name="taskId" id="taskId" value="${taskId}"/>
                            <input type="hidden" name="stateCode" id="stateCode" value="${quotedInfo.stateCode}"/>
                            <input type="hidden" name="processInstanceId" id="processInstanceId" value="${processInstanceId}"/>
                        </h5>
                    </div>
                    <div id="quotepreDescDetail">
                        <div class="form-group">
                            <label class="col-xs-2  control-label" for="projectName"> 项目名称 </label>
                            <div class="col-xs-3">
                                <input type="text" id="projectName" name="projectName" placeholder="项目名称"
                                       class="col-xs-10 col-sm-12" value="${quotedInfo.projectName}"  disabled="disabled"/>
                            </div>
                            <label class="col-xs-2  control-label" for="bomName">款式</label>
                            <div class="col-xs-3">
                                <input type="text" id="bomName" name="bomName" placeholder="款式" class="col-xs-10 col-sm-12" value="${quotedInfo.bomName}"  disabled="disabled"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-xs-2  control-label" for="spName"> 成衣厂 </label>
                            <div class="col-xs-3">
                                <input type="text" id="spName" name="spName" placeholder="成衣厂"
                                       class="col-xs-10 col-sm-12" value="${quotedInfo.spName}"  disabled="disabled"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <input type="hidden" name="spId" id="spId"/>
                            <input type="hidden" name="fabricId" id="fabricId"/>
                            <label class="col-xs-2  control-label" for="costing">成本核算(￥)</label>
                            <div class="col-xs-3">
                                <input type="text" id="costing" name="costing" placeholder="成本核算(￥)" class="col-xs-10 col-sm-12" value="${quotedInfo.costing}"/>
                            </div>
                            <label class="col-xs-2  control-label" for="exchangeCosts"> 换汇成本(小数形式) </label>
                            <div class="col-xs-3">
                                <input type="text" id="exchangeCosts" name="exchangeCosts" placeholder="换汇成本，e.g.0.65"
                                       class="col-xs-10 col-sm-12" value="${quotedInfo.exchangeCosts}"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-xs-2  control-label" for="factoryOffer"> 工厂报价(￥) </label>
                            <div class="col-xs-3">
                                <input type="text" id="factoryOffer" name="factoryOffer" placeholder="工厂报价"
                                       class="col-xs-10 col-sm-12" value="${quotedInfo.factoryOffer}"/>
                            </div>
                            <label class="col-xs-2  control-label" for="euroPrice">欧元报价(€)</label>
                            <div class="col-xs-3">
                                <input type="text" id="euroPrice" name="euroPrice" placeholder="欧元报价(€)" class="col-xs-10 col-sm-12" value="${quotedInfo.euroPrice}"/>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-xs-2  control-label" for="factoryMargins"> 工厂报价利润率</label>
                            <div class="col-xs-3">
                                <input type="text" id="factoryMargins" name="factoryMargins" placeholder=" 工厂报价利润率"
                                       class="col-xs-10 col-sm-12" value="${quotedInfo.factoryMargins}"/>
                            </div>
                            <label class="col-xs-2  control-label" for="lpPrice"> 包装费(€) </label>
                            <div class="col-xs-3">
                                <input type="text" id="lpPrice" name="lpPrice" placeholder="包装费(€) " class="col-xs-10 col-sm-12" value="${quotedInfo.lpPrice}"/>
                            </div>
                        </div>

                    </div>
                </div>

                <div id="btnInfo">

                </div>
            </form>


        </div>
        <!-- Button trigger modal -->
    </div>
</div>
</body>
</html>
<jsp:include page="../../base/hb-footj.jsp"></jsp:include>
<script type="text/javascript" src="<%=path%>/resources/js/interfaces/development/quotepre/quotepre-edit.js"></script>