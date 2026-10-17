package online.viralsnap.app;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Backward-compatible edge-to-edge on API < 35 (required by Google Play vitals).
        WindowCompat.enableEdgeToEdge(getWindow());
        super.onCreate(savedInstanceState);
    }
}
