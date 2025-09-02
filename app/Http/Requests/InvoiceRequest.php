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

    public function messages(): array
    {
        return[
            'full_name.required' => __('validation.full_name_is_required'),
            'tin_no.required' => __('validation.tin_number_is_required'),
            'id_no.required' => __('validation.id_number_is_required'),
            'sst_no.required' => __('validation.sst_number_is_required'),
            'email.required' => __('validation.email_is_required'),
            'email.email' => __('validation.enter_a_valid_email_address'),
            'contact.required' => __('validation.contact_number_is_required'),
            'contact.regex' => __('validation.contact_number_must_be_between'),
            'addressLine1.required' => __('validation.address_line_is_required'),
            'city.required' => __('validation.city_is_required'),
            'postcode.required' => __('validation.postcode_is_required'),
            'postcode.digits' => __('validation.postcode_must_be_exactly'),
            'state.required' => __('validation.state_is_required'),
            'country.required' => __('validation.country_is_required'),
            'id_type.required' => __('validation.please_select_an_id_type'),
            'business_registration.required' => __('validation.brn_is_required'),
            'type.required' => __('validation.invoice_type_is_required'),
            'type.in' => __('validation.invoice_type_must_be_personal_business'),
        ];
    }

    
}
