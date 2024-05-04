class UploadController {
   async upload(req, res) {
      try {
        if (req.files) {
          const uploadedFilesPaths = [];
          for (const key in req.files) {
            const file = req.files[key];
            const filePath = file.path;
            uploadedFilesPaths.push(filePath);
            console.log('Файл был загружен:', filePath);
          }
          console.log(uploadedFilesPaths)
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
