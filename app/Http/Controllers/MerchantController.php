<?php

namespace App\Http\Controllers;
use App\Models\Merchant;
use App\Services\RunningNumberService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MerchantController extends Controller
{
    public function Merchant()
    {
        return Inertia::render('Merchant/Merchant');
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
   public function updateStatus(Request $request, $id) {
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

}
