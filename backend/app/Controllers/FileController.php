<?php

namespace App\Controllers;

use CodeIgniter\Controller;

class FileController extends Controller
{
    public function serve($filename)
    {
        // Sanitize the filename to prevent directory traversal attacks
        $filename = basename($filename);

        // Path to the uploads directory
        $path = WRITEPATH . 'uploads/' . $filename;

        // Check if file exists and is a file
        if (!is_file($path)) {
            // Return a 404 response if the file is not found
            return $this->response->setStatusCode(404, 'File not found');
        }

        // Get the file's mime type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $path);
        finfo_close($finfo);

        // Set the headers for the response
        $this->response
            ->setHeader('Content-Type', $mimeType)
            ->setHeader('Content-Length', filesize($path))
            ->setHeader('Content-Disposition', 'inline; filename="' . $filename . '"');

        // Send the file contents as the response body
        return $this->response->setBody(file_get_contents($path));
    }
}
// This comment is added to force a file change and clear any lingering errors.
