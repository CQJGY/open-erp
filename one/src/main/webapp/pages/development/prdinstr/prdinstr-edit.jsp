<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="../../base/path.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>成衣生产指示单</title>
    <jsp:include page="../../base/hb-headc.jsp"></jsp:include>
    <jsp:include page="../../base/upload.jsp"></jsp:include>
    <link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/ace.css" class="ace-main-stylesheet"
          id="main-ace-style"/>
</head>
<body>
<div class="breadcrumbs" id="breadcrumbs">
    <ol class="breadcrumb">
        <li><a href="#">开发</a></li>
        <li><a href="#">预报价</a></li>
        <li class="active">列表</li>
    </ol>
</div>
<div class="page-content">
    <!-- PAGE CONTENT BEGINS -->
    <div class="row">
        <div class="col-xs-12">
            <form class="form-horizontal" role="form" id="prdinstrForm">
                <div id="prdinstrDesc">
                    <div id="prdinstrDescTitle">
                        <h5 class="header smaller lighter blue">
                            报价信息
                            <small></small>
                            <input type="hidden" name="bomId" id="bomId" value="${bomId}"/>
                            <input type="hidden" name="taskId" id="taskId" value="${taskId}"/>
                            <input type="hidden" name="stateCode" id="stateCode" value="${info.stateCode}"/>
                            <input type="hidden" name="approveStatus" id="approveStatus" value="${info.approveStatus}"/>
                            <input type="hidden" name="processInstanceId" id="processInstanceId"
                                   value="${processInstanceId}"/>
                            <input type="hidden" name="uid" id="uid"/>
                        </h5>
                    </div>
                    <div id="prdinstrDescDetail">
                        <div class="form-group">
                            <label class="control-label  col-xs-2" for="cropRequirements"> 裁剪要求 </label>
                            <div class="col-xs-3">
                                <textarea id="cropRequirements" name="cropRequirements"
                                          class="autosize-transition form-control col-xs-10 col-sm-12"
                                          placeholder="裁剪要求" value="${info.cropRequirements}"></textarea>
                            </div>

                            <label class="col-xs-2  control-label" for="qualityRequirements"> 工艺及质量要求</label>
                            <div class="col-xs-3">
                                <textarea id="qualityRequirements" name="qualityRequirements"
                                          class="autosize-transition form-control col-xs-10 col-sm-12"
                                          placeholder="工艺及质量要求" value="${info.qualityRequirements}"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label  col-xs-2" for="finishPressingRequirements"> 整烫要求 </label>
                            <div class="col-xs-3">
                                <textarea id="finishPressingRequirements" name="finishPressingRequirements"
                                          class="autosize-transition form-control col-xs-10 col-sm-12"
                                          placeholder="整烫要求" value="${info.finishPressingRequirements}"></textarea>
                            </div>

                            <label class="col-xs-2  control-label" for="spcialTech"> 特殊工艺</label>
                            <div class="col-xs-3">
                                <textarea id="spcialTech" name="spcialTech"
                                          class="autosize-transition form-control col-xs-10 col-sm-12"
                                          placeholder="特殊工艺" value="${info.spcialTech}"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label  col-xs-2" for="packingRequirements"> 包装要求 </label>
                            <div class="col-xs-3">
                                <textarea id="packingRequirements" name="packingRequirements"
                                          class="autosize-transition form-control col-xs-10 col-sm-12"
                                          placeholder="包装要求" value="${info.packingRequirements}"></textarea>
                            </div>

                        </div>

                        <div class="form-group">
                            <label class="control-label  col-xs-2" for="overstitch">面线</label>
                            <div class="col-xs-3">
                                <input type="text" id="overstitch" name="overstitch" placeholder="面线"
                                       class="col-xs-10 col-sm-12" value="${info.overstitch}"/>
                            </div>

                            <label class="control-label  col-xs-2" for="overstitchSpace">面线针距</label>
                            <div class="col-xs-3">
                                <input type="text" id="overstitchSpace" name="overstitchSpace" placeholder="面线针距"
                                       class="col-xs-10 col-sm-12" value="${info.overstitchSpace}"/>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label  col-xs-2" for="blindstitch">暗线</label>
                            <div class="col-xs-3">
                                <input type="text" id="blindstitch" name="blindstitch" placeholder="暗线"
                                       class="col-xs-10 col-sm-12" value="${info.blindstitch}"/>
                            </div>

                            <label class="control-label  col-xs-2" for="blindstitchSpace">暗线针距</label>
                            <div class="col-xs-3">
                                <input type="text" id="blindstitchSpace" name="blindstitchSpace" placeholder="暗线针距"
                                       class="col-xs-10 col-sm-12" value="${info.blindstitchSpace}"/>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label  col-xs-2" for="overlock">拷边</label>
                            <div class="col-xs-3">
                                <input type="text" id="overlock" name="overlock" placeholder="拷边"
                                       class="col-xs-10 col-sm-12" value="${info.overlock}"/>
                            </div>

                            <label class="control-label  col-xs-2" for="overlockSpace">拷边针距</label>
                            <div class="col-xs-3">
                                <input type="text" id="overlockSpace" name="overlockSpace" placeholder="拷边针距"
                                       class="col-xs-10 col-sm-12" value="${info.overlockSpace}"/>
                            </div>

                        </div>

                        <div class="form-group">
                            <label class="control-label  col-xs-2" for="trademarkCode">商标编码</label>
                            <div class="col-xs-3">
                                <input type="text" id="trademarkCode" name="trademarkCode" placeholder="商标编码"
                                       class="col-xs-10 col-sm-12" value="${info.trademarkCode}"/>
                            </div>

                            <label class="control-label  col-xs-2" for="trademarkRemark">商标描述</label>
                            <div class="col-xs-3">
                                <input type="text" id="trademarkRemark" name="trademarkRemark" placeholder="商标描述"
                                       class="col-xs-10 col-sm-12" value="${info.trademarkRemark}"/>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label  col-xs-2" for="scaleCode">尺标编码</label>
                            <div class="col-xs-3">
                                <input type="text" id="scaleCode" name="scaleCode" placeholder="尺标编码"
                                       class="col-xs-10 col-sm-12" value="${info.scaleCode}"/>
                            </div>

                            <label class="control-label  col-xs-2" for="scaleRemark">尺标描述</label>
                            <div class="col-xs-3">
                                <input type="text" id="scaleRemark" name="scaleRemark" placeholder="尺标描述"
                                       class="col-xs-10 col-sm-12" value="${info.scaleRemark}"/>
                            </div>

                        </div>

                        <div class="form-group">
                            <label class="control-label  col-xs-2" for="rinsingMarksCode">水洗标编码</label>
                            <div class="col-xs-3">
                                <input type="text" id="rinsingMarksCode" name="rinsingMarksCode" placeholder="水洗标编码"
                                       class="col-xs-10 col-sm-12" value="${info.rinsingMarksCode}"/>
                            </div>

                            <label class="control-label  col-xs-2" for="rinsingMarksRemark">水洗标描述</label>
                            <div class="col-xs-3">
                                <input type="text" id="rinsingMarksRemark" name="rinsingMarksRemark" placeholder="水洗标描述"
                                       class="col-xs-10 col-sm-12" value="${info.rinsingMarksRemark}"/>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label  col-xs-2" for="sketchUrlUid"> 款式图 </label>
                            <div class="col-xs-3">
                                <input id="sketchUrlUid" type="file" multiple class="file-loading col-xs-12"
                                       name="fileLocation">
                            </div>
                            <label class="col-xs-2  control-label" for="specificationUrlUid"> 规格表</label>
                            <div class="col-xs-3">
                                <input id="specificationUrlUid" type="file" multiple class="file-loading col-xs-12"
                                       name="fileLocation">
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
<script type="text/javascript" src='<%=path%>/resources/js/fileinput.js'></script>
<script type="text/javascript" src='<%=path%>/resources/js/fileinput_locale_zh.js'></script>
<script type="text/javascript" src="<%=path%>/resources/js/interfaces/development/prdinstr/prdinstr-edit.js"></script>