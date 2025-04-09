<?php

namespace App\Http\Controllers;

use App\Models\Classification;
use App\Models\Country;
use App\Models\MSICcode;
use App\Models\State;
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

    public function getCountries()
    {

        $country = Country::get();

        return response()->json($country);
    }

    public function getStates()
    {

        $state = State::get();

        return response()->json($state);
    }
}
