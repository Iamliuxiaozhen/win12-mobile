package online.win12.mobile;

import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.view.OrientationEventListener;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private OrientationEventListener orientationListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        orientationListener = new OrientationEventListener(this) {
            @Override
            public void onOrientationChanged(int orientation) {
                if (orientation == ORIENTATION_UNKNOWN) return;

                boolean deviceIsLandscape =
                    (orientation >= 45 && orientation <= 135) ||
                    (orientation >= 225 && orientation <= 315);

                if (deviceIsLandscape) {
                    setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
                    disable();
                }
            }
        };

        if (orientationListener.canDetectOrientation()) {
            orientationListener.enable();
        }
    }

    @Override
    public void onDestroy() {
        if (orientationListener != null) {
            orientationListener.disable();
        }
        super.onDestroy();
    }
}
