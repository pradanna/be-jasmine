<?php

namespace App\Presentation\Http\Controllers\Admin;

use App\Application\Setting\DTOs\SettingData;
use App\Application\Setting\UseCases\UpdateSettings;
use App\Domain\Setting\Repositories\SettingRepositoryInterface;
use App\Presentation\Http\Requests\Admin\UpdateSettingsRequest;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function __construct(
        private readonly SettingRepositoryInterface $settings,
        private readonly UpdateSettings $updateSettings,
    ) {}

    public function index(): Response
    {
        $settings = collect($this->settings->findPublic());
        return Inertia::render('Setting/Index', ['settings' => $settings]);
    }

    public function update(UpdateSettingsRequest $request)
    {
        $data = $request->only([
            'whatsapp_number', 'hero_title', 'hero_subtitle', 'store_name', 'store_description',
        ]);

        if ($request->hasFile('hero_image')) {
            $path = $request->file('hero_image')->store('settings', 'public');
            $data['hero_image'] = Storage::disk('public')->url($path);
        }

        $this->updateSettings->execute(new SettingData($data));
        return back()->with('success', 'Pengaturan berhasil disimpan.');
    }
}
