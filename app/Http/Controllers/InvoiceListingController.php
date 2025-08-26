<?php

namespace App\Http\Controllers;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Configuration;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class InvoiceListingController extends Controller
{
    public function invoiceListing()
    {

        return Inertia::render('InvoiceListing/InvoiceListing');
    }
    public function getInvoiceListing(Request $request)
    {
        $query = Invoice::with(['merchant', 'merchant.msic', 'invoice_lines']);

        // Filter by status
        if ($request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by search
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('invoice_no', 'like', "%{$search}%");
            });
        }

        // Filter by merchant
        if ($request->filled('merchant')) {
            $merchantUid = $request->merchant;

            $query->whereHas('merchant', function ($q) use ($merchantUid) {
                $q->where('merchant_uid', $merchantUid);
            });
        }

        // Filter by dates
        if ($request->filled('dates') && count($request->dates) === 2) {
            [$start, $end] = $request->dates;

            // Convert from UTC → Asia/Kuala_Lumpur
            $startDate = Carbon::parse($start)
                ->setTimezone('Asia/Kuala_Lumpur')
                ->startOfDay();

            $endDate = Carbon::parse($end)
                ->setTimezone('Asia/Kuala_Lumpur')
                ->endOfDay();

            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        $invoices = $query->latest()->get();

        return response()->json($invoices);
    }

    public function getInvoiceStatus()
    {
        $statuses = Invoice::select('invoice_status', DB::raw('count(*) as total'))
            ->whereIn('invoice_status', ['pending', 'consolidated', 'Submitted', 'Valid', 'Invalid'])
            ->groupBy('invoice_status')
            ->pluck('total', 'invoice_status');

        return response()->json([
            'pending'      => $statuses->get('pending', 0),
            'consolidated' => $statuses->get('consolidated', 0),
            'submitted'    => $statuses->get('Submitted', 0),
            'valid'        => $statuses->get('Valid', 0),
            'invalid'      => $statuses->get('Invalid', 0),
        ]);
    }
    
}