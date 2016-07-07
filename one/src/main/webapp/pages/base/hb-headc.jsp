<%@ page import="com.skysport.interfaces.constant.WebConstants" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="../base/path.jsp" %>
<link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/bootstrap.css"/>
<link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/dataTables.bootstrap.css"/>
<link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/font-awesome.min.css"/>
<link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/chosen.css"/>
<link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/bootstrapValidator.min.css"/>
<link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/select2.css"/>
<link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/bootstrap-select.css"/>
<link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/font-awesome.css"/>
<link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/ace-fonts.css"/>
<link rel="stylesheet" type="text/css" href="<%=path%>/resources/css/page-header.css"/>
<script type="text/javascript">
    var path = '<%=path%>';
    var blc_type_fuhe = '<%=WebConstants.BLC_TYPE_FUHE%>';
    var ble_type_tiemo = '<%=WebConstants.BLE_TYPE_TIEMO%>';
    var approve_status_new = '<%=WebConstants.APPROVE_STATUS_NEW%>';
    var approve_status_reject = '<%=WebConstants.APPROVE_STATUS_REJECT%>';
    var approve_status_undo = '<%=WebConstants.APPROVE_STATUS_UNDO%>';
    var approve_status_pass = '<%=WebConstants.APPROVE_STATUS_PASS%>';
    var approve_status_other = '<%=WebConstants.APPROVE_STATUS_OTHER%>';
    var quote_reference_yes = '<%=WebConstants.QUOTE_REFERENCE_YES%>';
    var spe = '<%=WebConstants.SPE%>';
    var environment_current = '<%=environment_current%>';
    var statecode_alive = '<%=WebConstants.STATECODE_ALIVE%>';
    var is_show_fabric = '<%=WebConstants.IS_SHOW_FABRIC%>'
</script>