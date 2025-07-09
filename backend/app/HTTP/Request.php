<?php

namespace App\HTTP;

use CodeIgniter\HTTP\IncomingRequest;

class Request extends IncomingRequest
{
    /**
     * @var object|null
     */
    public $user;
}
