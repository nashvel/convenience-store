<?php

namespace App\Controllers;

use CodeIgniter\Controller;

class FileController extends Controller
{
    public function serveLogo($filename)
    {
        return $this->serveFile($filename, 'logos');
    }

    public function serveProductImage($filename)
    {
        return $this->serveFile($filename, 'products');
    }

    private function serveFile($filename, $directory)
    {
        $filename = basename($filename);
        $path = WRITEPATH . 'uploads/' . $directory . '/' . $filename;

        if (!is_file($path)) {
            return $this->response->setStatusCode(404, 'File not found');
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $path);
        finfo_close($finfo);

        return $this->response
            ->setHeader('Content-Type', $mimeType)
            ->setBody(file_get_contents($path));
    }
}
// This comment is added to force a file change and clear any lingering errors.
