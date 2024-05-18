class UploadController {
   async upload(req, res) {
       try {
           if (req.files) {
               const uploadedFilesPaths = [];
               Object.keys(req.files).forEach(key => {
                   req.files[key].forEach(file => {
                       const filePath = file.path;
                       uploadedFilesPaths.push(filePath);
                   });
               });
               console.log('Uploaded files paths:', uploadedFilesPaths);
               res.json({ filePath: uploadedFilesPaths });
           } else {
               res.status(400).json({ error: 'Файлы не были загружены' });
           }
       } catch (error) {
           console.error('Ошибка при загрузке файлов:', error);
           res.status(500).json({ error: 'Ошибка при загрузке файлов' });
       }
   }
}

module.exports = new UploadController();
