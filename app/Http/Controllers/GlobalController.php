<?php

namespace App\Http\Controllers;

use App\Models\Classification;
use App\Models\MSICcode;
use Illuminate\Http\Request;

class GlobalController extends Controller
{
    //

    public function getClassification()
    {

        $classifications = Classification::get();

        return response()->json($classifications);
    }

    public function getMSICcode()
    {

        $msices = MSICcode::get();

        return response()->json($msices);
    }
}
