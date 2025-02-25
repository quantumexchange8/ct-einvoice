<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Configuration;
use App\Models\RunningNumber;
use Inertia\Inertia;
use App\Models\State;

class ConfigurationController extends Controller
{
    public function Configuration()
    {
        return Inertia::render('Configuration/Configuration');
    }

    public function getConfiguration()
    {
        $configurations = Configuration::get();
        return response()->json($configurations);
    }

    public function getStates()
    {
        $states = State::get();
        return response()->json($states);
    }
    public function updateConfiguration(Request $request)
    {
  
        // dd($request->all());
        $validated = $request->validate([
            'invoicePrefix' => 'nullable|string|max:255',
            'invoice' => 'nullable|string|max:255',
            'companyName' => 'required|string|max:255',
            'tin' => 'nullable|string|max:255',
            'registration' => 'nullable|string|max:255',
            'MSIC' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'required|email',
            'sst' => 'nullable|string|max:255',
            'businessActivity' => 'nullable|string|max:255',
            'address1' => 'nullable|string|max:255',
            'address2' => 'nullable|string|max:255',
            'poscode' => 'nullable|string|max:255',
            'area' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
       

        $configuration = Configuration::first();

        if ($configuration) {
            $configuration->update([
                'invoicePrefix' =>  $request->invoicePrefix,
                'invoice' =>  $request->invoice,
                 'image' =>  $request->image,
                'companyName' =>  $request->companyName,
                'tin' =>  $request->tin,
                'registration' =>  $request->registration,
                'MSIC' =>  $request->MSIC,
                'phone' =>  $request->phone,
                'email' =>  $request->email,
                'sst' =>  $request->sst,
                'businessActivity' =>  $request->businessActivity,
                'address1' =>  $request->address1,
                'address2' =>  $request->address2,
                'poscode' =>  $request->poscode,
                'area' =>  $request->area,
                'state' =>  $request->state,
            ]);
        } else {
            $configuration = Configuration::create([
                'invoicePrefix' =>  $request->invoicePrefix,
                'invoice' =>  $request->invoice,
                'image' =>  $request->image,
                'companyName' =>  $request->companyName,
                'tin' =>  $request->tin,
                'registration' =>  $request->registration,
                'MSIC' =>  $request->MSIC,
                'phone' =>  $request->phone,
                'email' =>  $request->email,
                'sst' =>  $request->sst,
                'businessActivity' =>  $request->businessActivity,
                'address1' =>  $request->address1,
                'address2' =>  $request->address2,
                'poscode' =>  $request->poscode,
                'area' =>  $request->area,
                'state' =>  $request->state,
            ]);

            $runningNumber = RunningNumber::create([
                'type' => 'configuration',
                'prefix' => $request->invoicePrefix,
                'digit' => '6',
                'last_number' => '0'
            ]);
        }
    // Handle image upload using Spatie
    if ($request->hasFile('image')) {
        $configuration->clearMediaCollection('configuration_image'); // Remove old image
        $configuration->addMedia($request->file('image'))->toMediaCollection('configuration_images');
    }

    return response()->json([
        'message' => 'Configuration saved successfully!',
        'data' => $configuration->load('media')
    ], 200);

        return response()->json(['message' => 'Configuration saved successfully!', 'data' => $configuration], 200);
    }
}
