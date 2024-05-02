class UploadController {
    async upload(req, res) {
      try {
         console.log("its req.file")
         console.log(req.file)
         if (req.file) {
            const filePath = req.file.path;
            console.log('Файл был загружен:', filePath);
            res.json({ filePath });
         } else {
            res.status(400).json({ error: 'Файл не был загружен' });
         }
      } catch (error) {
         console.error('Ошибка при загрузке файла:', error);
         res.status(500).json({ error: 'Ошибка при загрузке файла' });
      }
   }
}

module.exports = new UploadController();
