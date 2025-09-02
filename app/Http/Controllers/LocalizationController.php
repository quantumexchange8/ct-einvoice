<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class LocalizationController extends Controller
{
    public function setLang($locale)
    {
        // if (!in_array($locale, ['en', 'cn', 'indo', 'japan', 'korea', 'taiwan', 'thai', 'viet'])) {
        if (!in_array($locale, ['en', 'cn'])) {
            abort(400);
        }

        App::setlocale($locale);
        Session::put("locale", $locale);
        
        return back();
    }
}
