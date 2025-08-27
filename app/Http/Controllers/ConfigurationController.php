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
        $adminDetails = Configuration::first();

        return Inertia::render('Configuration/Configuration', [
            'adminDetails' => $adminDetails,
        ]);
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
            'company_name' => 'required|string|max:255',
            'tin' => 'required|string|max:255',
            'registration' => 'required|string|max:255',
            'sst' => 'nullable|string|max:255',
            'irbm_client_id' => 'required|string|max:255',
            'irbm_client_key' => 'required|string|max:255',
            'phone' => 'required',
            'email' => 'required|email',
            'MSIC' => 'required|string|max:255',
            'defaultClassification' => 'required|string|max:255',
            'businessActivity' => 'nullable|string|max:255',
            'address1' => 'required|string|max:255',
            'address2' => 'nullable|string|max:255',
            'area' => 'required|string|max:255',
            'poscode' => 'required',
            'state' => 'required',
            'country' => 'required'
        ]);
       

        $configuration = Configuration::first();

        if ($configuration) {
            $configuration->update([
                'companyName' => $request->company_name,
                'tin' => $request->tin,
                'registration' => $request->registration,
                'sst' => $request->sst,
                'irbm_client_id' => $request->irbm_client_id,
                'irbm_client_key' => $request->irbm_client_key,
                'phone' => $request->phone,
                'email' => $request->email,
                'MSIC' => $request->MSIC,
                'defaultClassification' => $request->defaultClassification,
                'businessActivity' => $request->businessActivity,
                'address1' => $request->address1,
                'address2' => $request->address2,
                'area' => $request->area,
                'poscode' => $request->poscode,
                'state' => $request->state,
                'country' => $request->country
            ]);
        } else {
            $configuration = Configuration::create([
                'companyName' => $request->company_name,
                'tin' => $request->tin,
                'registration' => $request->registration,
                'sst' => $request->sst,
                'irbm_client_id' => $request->irbm_client_id,
                'irbm_client_key' => $request->irbm_client_key,
                'phone' => $request->phone,
                'email' => $request->email,
                'MSIC' => $request->MSIC,
                'defaultClassification' => $request->defaultClassification,
                'businessActivity' => $request->businessActivity,
                'address1' => $request->address1,
                'address2' => $request->address2,
                'area' => $request->area,
                'poscode' => $request->poscode,
                'state' => $request->state,
                'country' => $request->country
            ]);

            $runningNumber = RunningNumber::create([
                'type' => 'configuration',
                'prefix' => $request->invoicePrefix,
                'digit' => '6',
                'last_number' => '0'
            ]);
        }
    // Handle image upload using Spatie
    // if ($request->hasFile('image')) {
    //     $configuration->clearMediaCollection('configuration_image'); // Remove old image
    //     $configuration->addMedia($request->file('image'))->toMediaCollection('configuration_images');
    // }

        return redirect()->back();
    }
}
