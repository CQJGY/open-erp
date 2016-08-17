<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<div class="page-content">
    <!-- PAGE CONTENT BEGINS -->
    <div class="row">
        <div class="col-xs-12">
            <table id="roleInfoExample" class="table table-striped table-bordered table-hover">
                <thead>
                <tr>
                    <th style="text-align: center">角色名</th>
                    <th style="text-align: center">父角色</th>
                    <th style="text-align: center">所属部门</th>
                    <th style="text-align: center">角色描述</th>
                    <th style="text-align: center">备注</th>
                    <th style="text-align: center">最后修改时间</th>
                    <th style="text-align: center">操作</th>
                </tr>
                </thead>
                <tbody></tbody>
                <!-- tbody是必须的 -->
            </table>
        </div>
        <!-- Button trigger modal -->
    </div>
</div>
<!--定义操作列按钮模板-->
<script id="roleInfotpl" type="text/x-handlebars-template">
    {{#each func}}
    <button type="button" class="btn btn-{{this.type}} btn-sm" onclick="{{this.fn}}">{{this.name}}</button>
    {{/each}}
</script>
<script type="text/javascript" src="<%=path%>/resources/js/interfaces/system/permission/roleinfo-list.js?v=<%=version%>"></script>