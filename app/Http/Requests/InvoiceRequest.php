<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $type = $this->input('type');

        if ($type === 'Personal') {
            return [
                'full_name' => 'required|max:255',
                'tin_no' => 'required',
                'id_no' => 'required',
                'sst_no' => 'required',
                'email' => 'required|email|max:255',
                'contact' => 'required|regex:/^\+?[0-9]{10,15}$/',
                'addressLine1' => 'required',
                'city' => 'required',
                'postcode' => 'required|digits:5',
                'state' => 'required',
                'country' => 'required',
                'id_type'=> 'required',
                'type' => 'required|in:Personal,Business', 
            ];
        } else {
            return [
                'full_name' => 'required|max:255',
                'tin_no' => 'required',
                'sst_no' => 'required',
                'email' => 'required|email|max:255',
                'contact' => 'required|regex:/^\+?[0-9]{10,15}$/',
                'addressLine1' => 'required',
                'city' => 'required',
                'postcode' => 'required|digits:5',
                'state' => 'required',
                'country' => 'required',
                'business_registration'=> 'required',
                'type' => 'required|in:Personal,Business', 
            ]; 
        }

    }

    
}
