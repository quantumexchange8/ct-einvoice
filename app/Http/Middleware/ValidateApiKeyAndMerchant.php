<?php

namespace App\Http\Middleware;

use App\Models\Merchant;
use App\Models\PayoutConfig;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateApiKeyAndMerchant
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = $request->header('X-API-KEY');
        $merchantId = $request->header('MERCHANT-ID');

        $merchant = Merchant::find($merchantId);

        if (!$merchant) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Merchant not found',
            ], 400);
        }

        $payout = PayoutConfig::where('merchant_id', $merchant->id)->first();

        if (!$apiKey || $apiKey !== $payout->secret_key) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Invalid API key',
            ], 403);
        }

        // Attach merchant and payout to the request
        $request->merge([
            'merchant' => $merchant,
            'payout' => $payout,
        ]);

        return $next($request);
    }
}
