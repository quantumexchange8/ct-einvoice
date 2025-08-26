<?php

namespace App\Http\Controllers;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Configuration;
use App\Models\InvoiceLog;
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

    public function getInvoiceStatus(Request $request)
    {
        $monthMap = [
            'jan' => 1, 'feb' => 2, 'mar' => 3, 'april' => 4,
            'may' => 5, 'jun' => 6, 'july' => 7, 'aug' => 8,
            'sep' => 9, 'oct' => 10, 'nov' => 11, 'dec' => 12,
        ];

        $month = $monthMap[strtolower($request->selectedMonth)] ?? null;

        if (!$month) {
            return response()->json(['error' => 'Invalid month'], 422);
        }

        $statuses = Invoice::select('invoice_status', DB::raw('count(*) as total'))
            ->whereMonth('updated_at', $month)
            ->whereIn('invoice_status', ['pending', 'Submitted', 'Valid', 'Invalid'])
            ->groupBy('invoice_status')
            ->pluck('total', 'invoice_status');

        $consolidate = InvoiceLog::whereMonth('updated_at', $month)->count();

        return response()->json([
            'pending'      => $statuses->get('pending', 0),
            'consolidated' => $consolidate,
            'submitted'    => $statuses->get('Submitted', 0),
            'valid'        => $statuses->get('Valid', 0),
            'invalid'      => $statuses->get('Invalid', 0),
        ]);
    }

    public function getInvoiceChartData(Request $request)
    {
        $year = $request->selectedYear; // current year

        // Fetch only invoices from the start of the year until today
        $data = Invoice::selectRaw('MONTH(created_at) as month, status, COUNT(*) as total')
            ->whereYear('created_at', $year)
            ->whereIn('status', ['Valid', 'Invalid']) // only these statuses
            ->groupBy('month', 'status')
            ->orderBy('month')
            ->get();

        return response()->json($data);
    }

    
}