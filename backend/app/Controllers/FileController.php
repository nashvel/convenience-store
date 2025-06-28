<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\ResponseInterface;

class FileController extends Controller
{
    public function serveLogo($filename)
    {
        // Sanitize the filename to prevent directory traversal attacks
        $filename = basename($filename);
        $path = FCPATH . 'uploads/logos/' . $filename;

        if (!file_exists($path) || !is_file($path)) {
            return $this->response->setStatusCode(ResponseInterface::HTTP_NOT_FOUND, 'Logo not found');
        }

        // Get the file's mime type
        $mime = mime_content_type($path);
        if ($mime === false) {
            $mime = 'application/octet-stream';
        }

        // Use CodeIgniter's response object to send the file
        // This allows other 'after' filters (like CORS) to run
        return $this->response
            ->setStatusCode(ResponseInterface::HTTP_OK)
            ->setContentType($mime)
            ->setBody(file_get_contents($path));
    }
}
