package com.skysport.interfaces.action.common;

import com.skysport.core.action.BaseAction;
import com.skysport.core.annotation.SystemControllerLog;
import com.skysport.core.bean.permission.UserInfo;
import com.skysport.core.constant.CharConstant;
import com.skysport.core.cache.DictionaryInfoCachedMap;
import com.skysport.core.utils.DateUtils;
import com.skysport.core.utils.UuidGeneratorUtils;
import com.skysport.interfaces.bean.basic.InitialPreviewConfig;
import com.skysport.interfaces.bean.common.UploadFileInfo;
import com.skysport.interfaces.constant.WebConstants;
import com.skysport.interfaces.model.common.uploadfile.IUploadFileInfoService;
import com.skysport.interfaces.model.common.uploadfile.helper.UploadFileHelper;
import com.skysport.interfaces.utils.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 说明:
 * Created by zhangjh on 2015/9/15.
 */
@Scope("prototype")
@Controller
@RequestMapping("/files")
public class FileUpDownAction extends BaseAction<UserInfo> {

    Logger logger = LoggerFactory.getLogger(getClass());
    @Resource(name = "uploadFileInfoService")
    IUploadFileInfoService uploadFileInfoService;

    /**
     * 由文件id删除文件记录表中的记录
     *
     * @param config
     * @param request
     * @return
     */
    @RequestMapping(value = "/del", method = RequestMethod.POST)
    @ResponseBody
    @SystemControllerLog(description = "删除文件")
    public Map<String, Object> delete(InitialPreviewConfig config, HttpServletRequest request) {
        String key = config.getKey();
        uploadFileInfoService.del(key, WebConstants.FILE_IN_FINISH);
        return rtnSuccessResultMap("文件删除成功");
    }

    /**
     * @param fileLocation
     * @param request
     * @return
     */
    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    @ResponseBody
    @SystemControllerLog(description = "上传附件")
    public Map<String, Object> upload(@RequestParam("fileLocation") MultipartFile[] fileLocation, HttpServletRequest request) throws InterruptedException {
        String contextPath = request.getContextPath();

        Map<String, Object> resultMap = new HashMap<String, Object>();
        List<UploadFileInfo> uploadFileInfos = new ArrayList<>();
        try {
            String yyyymm = DateUtils.SINGLETONE.getYyyyMm();
            String separator = "/";
            for (MultipartFile file : fileLocation) {

                // 判断文件是否为空
                if (!file.isEmpty()) {
                    //原始文件名
                    String fileName = file.getOriginalFilename();
                    StringBuilder realPath = new StringBuilder(request.getSession().getServletContext().getRealPath("/"));
                    String suffix = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.') + 1);
                    String pathType = FileUtils.SINGLETONE.getPathType(suffix);
                    String pathInPathType = DictionaryInfoCachedMap.SINGLETONE.getDictionaryValue(WebConstants.FILE_PATH, pathType);

                    //新文件名
                    String newFileNameId = UuidGeneratorUtils.getNextId();
                    String newFileName = new StringBuilder().append(newFileNameId).append(CharConstant.POINT).append(suffix).toString();
                    String filePath = new StringBuilder().append(separator).append("files").append(separator).append(pathInPathType).append(separator).append(yyyymm).append(separator).toString();
                    String fileUrl = new StringBuilder(contextPath).append(filePath).append(newFileName).toString();

                    //保存文件记录
                    UploadFileInfo uploadFileInfo = new UploadFileInfo();
                    uploadFileInfo.setUid(newFileNameId);
                    uploadFileInfo.setFileName(fileName);
                    uploadFileInfo.setNewFileName(newFileName);
                    uploadFileInfo.setFilePath(filePath);
                    uploadFileInfo.setFileUrl(fileUrl);
                    uploadFileInfo.setDelUrl(contextPath + "/files/del");
                    uploadFileInfo.setStatus(WebConstants.FILE_IN_PROCESS);
                    uploadFileInfo.setSuffix(suffix);
                    uploadFileInfo.setPathType(pathType);

                    uploadFileInfos.add(uploadFileInfo);


                    //保存文件记录
//                    Thread thread = new Thread(new UploadFileThread(uploadFileInfos, uploadFileInfoService));
//                    thread.start();
//                    thread.join();


                    File targetFile = new File(realPath.toString() + filePath, newFileName);
                    targetFile.mkdirs();
                    // 转存文件
                    file.transferTo(targetFile);

                }
            }
            uploadFileInfoService.addBatch(uploadFileInfos);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            resultMap.put("error", e.getMessage());
        }
        UploadFileHelper.SINGLETONE.buildInitialPreviewByFileRecords(resultMap, uploadFileInfos);


        // 重定向
        return resultMap;
    }


}
