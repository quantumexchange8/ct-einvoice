<?php

namespace App\Http\Controllers;

use App\Models\PayoutConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PayoutConfigController extends Controller
{
    //

    public function payoutConfig()
    {

        return Inertia::render('Payout/PayoutConfig');
    }

    public function getPayout()
    {
        if (App::environment('production')) {
            $payouts = PayoutConfig::where('env', 'production')->with(['merchant'])->get();
        } else {
            $payouts = PayoutConfig::whereNot('env', 'production')->with(['merchant'])->get();
        }
        

        return response()->json($payouts);
    }

    public function storePayout(Request $request)
    {
        
        $secretKey = Str::random(40);

        $payout = PayoutConfig::create([
            'merchant_id' => $request->merchant['id'],
            'env' => $request->env,
            'url' => $request->url,
            'callBackUrl' => $request->callback_url,
            'secret_key' => $secretKey,
        ]);

        return redirect()->back();
    }
}
