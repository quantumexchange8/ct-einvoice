<?php

namespace App\Http\Controllers;

use App\Models\Classification;
use App\Models\Country;
use App\Models\Merchant;
use App\Models\MSICcode;
use App\Models\State;
use App\Models\Token;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GlobalController extends Controller
{
    protected $env;
    public function __construct()
    {
        $this->env = env('APP_ENV');
    }

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

    public function searchTIN(Request $request)
    {
        $checkToken = Token::where('merchant_id', $request->merchant_id)->latest()->first();
        $merchantDetail = Merchant::find($request->merchant_id);
        $token = $this->getValidToken($merchantDetail, $checkToken);
        if (!$token) {
            return; // 或者返回错误
        }

        if ($request->searchType === 'taxpayerName') {
            $request->validate([
                'taxpayerName' => 'required|string|max:255',
            ]);

            $prodUrl = $this->env === 'production'
                    ? 'https://preprod-api.myinvois.hasil.gov.my/api/v1.0/taxpayer/search/tin?taxpayerName=' . $request->taxpayerName
                    : 'https://preprod-api.myinvois.hasil.gov.my/api/v1.0/taxpayer/search/tin?taxpayerName=' . $request->taxpayerName;

            
            $submiturl = Http::withToken($token)->get($prodUrl);

            Log::info('searchTIN ', [
                'url' => $prodUrl,
                'response' => $submiturl,
            ]);

            if ($submiturl->successful()) {
                return response()->json($submiturl['tin']);
            } else {
                return response()->json(['message' => 'Invalid search type'], 400);
            }
        }
        if ($request->searchType === 'idType') {
            $request->validate([
                'idType' => 'required|string|max:255',
                'TINValue' => 'required|string|max:255',
            ]);

            $prodUrl = $this->env === 'production'
                    ? 'https://preprod-api.myinvois.hasil.gov.my/api/v1.0/taxpayer/search/tin?idType=' . $request->taxpayerName . '&idValue=' . $request->TINValue
                    : 'https://preprod-api.myinvois.hasil.gov.my/api/v1.0/taxpayer/search/tin?idType=' . $request->taxpayerName . '&idValue=' . $request->TINValue;

            
            $submiturl = Http::withToken($token)->get($prodUrl);

            Log::info('searchTIN ', [
                'url' => $prodUrl,
                'response' => $submiturl,
            ]);

            if ($submiturl->successful()) {
                return response()->json($submiturl['tin']);
            } else {
                return response()->json(['message' => 'Invalid search type'], 400);
            }
        }


        return response()->json(['message' => 'Invalid search type'], 400);
        
    }

    protected function getValidToken($merchantDetail, $checkToken)
    {

        // 如果没有 token 或者 token 已过期，获取新 token
        if (!$checkToken || Carbon::now() >= $checkToken->expired_at) {
            $accessTokenApi = $this->env === 'production'
                ? 'https://preprod-api.myinvois.hasil.gov.my/connect/token'
                : 'https://preprod-api.myinvois.hasil.gov.my/connect/token';

            $response = Http::asForm()->post($accessTokenApi, [
                'client_id' => $merchantDetail->irbm_client_id,
                'client_secret' => $merchantDetail->irbm_client_key,
                'grant_type' => 'client_credentials',
                'scope' => 'InvoicingAPI',
            ]);

            if ($response->successful()) {
                // 删除旧的 token
                Token::where('merchant_id', $merchantDetail->id)->delete();

                // 创建新的 token
                return Token::create([
                    'merchant_id' => $merchantDetail->id,
                    'token' => $response['access_token'],
                    'expired_at' => Carbon::now()->addHour(),
                ])->token;
            } else {
                Log::error('Failed to get access token', [
                    'status' => $response->status(),
                    'error' => $response->body()
                ]);
                return null;
            }
        }

       // 返回有效的现有 token
        return $checkToken->token;
    }
}
