<?php

namespace App\Http\Controllers;
use App\Models\Merchant;
use App\Services\RunningNumberService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class   MerchantController extends Controller
{
    public function Merchant()
    {
        return Inertia::render('Merchant/Merchant');
    }

    public function addMerchant()
    {

        return Inertia::render('Merchant/AddMerchant');
    }

 
    public function submitMerchant(Request $request) 
    {
        $request->validate([
            'name' => 'required|max:255',
            'staging_url' => 'required|max:255',
            'live_url' => 'required|max:255', 
            'appID' => 'required',

        ]);

        $merchant = Merchant::create([
            'name' => $request->name,
            'merchant_uid' => RunningNumberService::getID('merchant'),
            'staging_url' => $request->staging_url,
            'live_url' => $request->live_url, 
            'appID' => $request->appID,
            'status' => 'ACTIVE',

        ]);

        return redirect()->back();
    }


    public function getMerchants()
    {
        $merchants = Merchant::get();

        return response()->json($merchants);

    }

    public function countTotalMerchant()
    {

        $total_client = Merchant::count();
        $active_client = Merchant::where('status', 'active')->count();
        $inactive_client = Merchant::where('status', 'inactive')->count();

        return response()->json([
            'total_client' => $total_client,
            'active_client' => $active_client ,
            'inactive_client' => $inactive_client,
        ]);
    }

    public function updateStatus(Request $request, $id) 
    {
        $merchant = Merchant::findOrFail($id);
        $merchant->status = $request->status;
        $merchant->save();

        return response()->json(['message' => 'Status updated successfully', 'status' => $merchant->status]);
    }

    public function updateMerchant(Request $request, $id)
    {
        $merchant = Merchant::find($id);

        if (!$merchant) {
            return response()->json(['message' => 'Merchant not found'], 404);
        }

        $merchant->update([
            'name' => $request->name,
            'staging_url' => $request->staging_url,
            'live_url' => $request->live_url,
            'appID' => $request->appID,
        ]);

        return response()->json(['message' => 'Merchant updated successfully', 'merchant' => $merchant]);
    }

    public function deleteMerchant($id)
    {
        $merchant = Merchant::find($id);

        if (!$merchant) {
            return response()->json(['message' => 'Merchant not found'], 404);
        }

        $merchant->delete();

        return response()->json(['message' => 'Merchant deleted successfully']);
    }

    public function validateStep1(Request $request)
    {

        $request->validate([
            'merchant_name' => 'required|max:255|unique:merchants,name',
            'merchant_email' => 'required|email|max:255|unique:merchants,email',
            'merchant_contact' => 'required|max:255|unique:merchants,contact', 
            'address_1' => 'required',
            'city' => 'required',
            'state' => 'required',
            'postal_code' => 'required',
            'country' => 'required',
            'tin_no' => 'required|unique:merchants,tin_no',
            'brn_no' => 'required|unique:merchants,brn_no',
            'classification_code' => 'required',
            'msic_code' => 'required',
            'irbm_client_id' => 'required|unique:merchants,irbm_client_id',
            'irbm_client_secret' => 'required|unique:merchants,irbm_client_key',
        ]);

        return redirect()->back();
    }

    public function storeMerchant(Request $request)
    {

        $merchant = Merchant::create([
            'name' => $request->merchant_name,
            'merchant_uid' => RunningNumberService::getID('merchant'),
            'registration_name' => $request->merchant_name,
            'irbm_client_id' => $request->irbm_client_id,
            'irbm_client_key' => $request->irbm_client_key,
            'tin_no' => $request->tin_no,
            'brn_no' => $request->brn_no,
            'sst_no' => $request->sst_no ?? null,
            'ttx_no' => $request->ttx_no ?? null,
            'msic_id' => $request->msic_code['id'],
            'classification_id' => $request->classification_code['id'],
            'address1' => $request->address_1,
            'address2' => $request->address_2 ?? null,
            'address3' => $request->address_3 ?? null,
            'city' => $request->city,
            'state_code' => $request->state['Code'],
            'country_code' => $request->country['code'],
            'status' => 'active',
        ]);

        return redirect()->back();
    }

}
