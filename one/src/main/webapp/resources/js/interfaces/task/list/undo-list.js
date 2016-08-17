/**
 * Created by zhangjh on 2015/7/16.
 */
(function () {
    "use strict";
    var path = $.basepath();
    var project_selectURL = path + "/system/baseinfo/project_select";
    var claimURL = path + "/task/claim/";
    var unclaimURL = path + "/task/unclaim/";
    var handleURL = path + "/task/handle/";
    var searchURL = path + "/task/todo/search/";
    /**
     * 列表展示内容
     * @returns {*[]}
     */
    var columnsName = [
        {"data": null},
        {"data": "businessName"},
        {"data": "name"},
        {"data": "createTime"},
        {"data": "suspended"},
        {"data": null}
    ];


    var mHtml = '';
    var table;

    $(function () {
        var tpl = $("#tpl").html();
        //预编译模板
        var template = Handlebars.compile(tpl);
        var indexOpreation = columnsName.length - 1;
        table = $('#example').DataTable({
            ajax: {
                url: searchURL
            },
            createdRow: function ( row, data, index ) {
                /* 设置表格中的内容居中 */
                $('td', row).attr("class","text-center");
            },
            serverSide: true,
            columns: columnsName,
            order: [[1, "desc"]], /*默认第一列倒序*/
            columnDefs: [
                {
                    targets: 0,
                    render: function (data, type, row, meta) {
                        var html = "<input type='checkbox' name='checkList' value='" + data.businessKey + "'>";
                        return html;
                    }
                },
                {
                    targets: 4,
                    render: function (data, type, row, meta) {
                        var html;
                        var _suspended = data.suspended;
                        var _version = data.version;
                        if (_suspended) {
                            html = "已挂起;";
                        } else {
                            html = "正常;";
                        }
                        html += "<b title='流程版本号'>流程版本号:" + _version + "</b>";
                        return html;
                    }
                },
                {
                    targets: indexOpreation,
                    render: function (data, type, row, meta) {
                        var _assignee = data.assignee;
                        var context;
                        if (null == _assignee) {
                            context =
                            {
                                func: [
                                    {
                                        "name": "签收",
                                        "fn": "$.claimTask(\'" + data.id + "\',\'" + data.businessKey + "\')",
                                        "type": "info"
                                    }
                                ]
                            };
                        }
                        else {
                            context =
                            {
                                func: [
                                    {
                                        "name": "处理",
                                        "fn": "$.handleTask(\'" + data.id + "\',\'" + data.businessKey + "\',\'" + data.processInstanceId + "\')",
                                        "type": "primary"
                                    },
                                    {
                                        "name": "反签收",
                                        "fn": "$.unclaimTask(\'" + data.id + "\',\'" + data.businessKey + "\',\'" + data.processInstanceId + "\')",
                                        "type": "danger"
                                    }
                                ]
                            };
                        }
                        var html = template(context);
                        return html;
                    }
                }
            ],
            "language": {
                "lengthMenu": "_MENU_",
                "zeroRecords": "没有找到记录",
                "info": "第 _PAGE_ 页 ( 共 _PAGES_ 页 )",
                "infoEmpty": "无记录",
                "infoFiltered": "(从 _MAX_ 条记录过滤)",
                "paginate": {
                    "previous": "上一页",
                    "next": "下一页"
                }
            },
            "dom": "<'row'<'col-xs-1'l><'#mytool.col-xs-9'><'col-xs-2'f>r>" +
            "t" +
            "<'row'<'col-xs-6'i><'col-xs-6'p>>",
            initComplete: function () {
                $("#mytool").append(mHtml);
            }

        });


    });

    /**
     * 签收任务
     * @param _taskId
     */
    var claimTask = function (_taskId, _businessKey) {
        $.sendRestFulAjax(claimURL + _taskId + "/" + _businessKey, null, 'GET', 'json', function (data) {
            table.ajax.reload( null, false);
        });
    }
    var unclaimTask = function (_taskId, _businessKey) {
        $.sendRestFulAjax(unclaimURL + _taskId + "/" + _businessKey, null, 'GET', 'json', function (data) {
            table.ajax.reload( null, false);
        });
    }
    /**
     * 办理任务
     * @param _businessKey
     */
    var handleTask = function (_taskId, _businessKey, _processInstanceId) {
        window.location.href = handleURL + _taskId + "/" + _businessKey + "/" + _processInstanceId;
    }
    $.extend({
        claimTask: claimTask,
        handleTask: handleTask,
        unclaimTask: unclaimTask
    });
}());