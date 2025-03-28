<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SubmitEInvoice extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:submit-e-invoice';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $pending_submit = Invoice::where('status', 'pending_submit')
                        ->whereNull('invoice_uuid')
                        ->get();

        if ($pending_submit->isEmpty()) {
            Log::info('No pending submission');
            return;
        }

        foreach ($pending_submit as $pending) {
            $this->processPendingSubmission($pending);
        }
    }

    protected function processPendingSubmission(Invoice $invoice)
    {
        
    }
}
