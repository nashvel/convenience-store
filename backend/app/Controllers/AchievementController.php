<?php

namespace App\Controllers;

use App\Models\Achievement;
use App\Models\RiderAchievement;
use CodeIgniter\RESTful\ResourceController;
use Exception;

class AchievementController extends ResourceController
{
    protected $modelName = 'App\Models\Achievement';
    protected $format    = 'json';

    /**
     * Get all achievements tailored for the logged-in rider.
     * It fetches all available achievements and merges them with the rider's specific progress.
     *
     * @return \CodeIgniter\HTTP\Response
     */
                    public function index()
    {
        try {
            $user = $this->request->user;

            if (!$user) {
                return $this->failUnauthorized('Authentication required.');
            }

            $achievementModel = new Achievement();

            if ($user->role === 'admin') {
                $allAchievements = $achievementModel->findAll();
                $result = array_map(function ($achievement) {
                    return [
                        'id'          => (int)$achievement['id'],
                        'title'       => $achievement['title'],
                        'description' => $achievement['description'],
                        'icon'        => $achievement['icon'],
                        'status'      => 'unlocked',
                        'progress'    => 100,
                    ];
                }, $allAchievements);

                return $this->respond($result);
            }

            if ($user->role === 'rider') {
                $riderId = $user->id;
                $riderAchievementModel = new RiderAchievement();

                $allAchievements = $achievementModel->findAll();
                $riderAchievements = $riderAchievementModel->where('rider_id', $riderId)->findAll();

                $riderProgressMap = [];
                foreach ($riderAchievements as $ra) {
                    $riderProgressMap[$ra['achievement_id']] = $ra;
                }

                $result = array_map(function ($achievement) use ($riderProgressMap) {
                    $current_progress = 0;
                    $unlocked_at = null;

                    if (isset($riderProgressMap[$achievement['id']])) {
                        $riderProgress = $riderProgressMap[$achievement['id']];
                        $current_progress = $riderProgress['progress'];
                        $unlocked_at = $riderProgress['unlocked_at'];
                    }

                    $status = 'locked';
                    if ($unlocked_at) {
                        $status = 'unlocked';
                    } elseif ($current_progress > 0) {
                        $status = 'in-progress';
                    }

                    $progress_percentage = 0;
                    if ($achievement['goal'] > 0) {
                        $progress_percentage = ($current_progress / $achievement['goal']) * 100;
                    }

                    if ($status === 'unlocked') {
                        $progress_percentage = 100;
                    }

                    return [
                        'id'          => (int)$achievement['id'],
                        'title'       => $achievement['title'],
                        'description' => $achievement['description'],
                        'icon'        => $achievement['icon'],
                        'status'      => $status,
                        'progress'    => (int)min(100, $progress_percentage),
                    ];
                }, $allAchievements);

                return $this->respond($result);
            }

            return $this->failForbidden('You do not have permission to view this resource.');

        } catch (Exception $e) {
            log_message('error', 'AchievementController::index() - ' . $e->getMessage());
            return $this->failServerError('An error occurred while fetching achievements.');
        }
    }
}
