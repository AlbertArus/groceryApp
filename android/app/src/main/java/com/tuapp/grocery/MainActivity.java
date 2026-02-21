package com.tuapp.grocery;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 1. Obtener la ventana de la actividad
        Window window = getWindow();

        // 2. Hacer que la barra de estado sea transparente
        window.setStatusBarColor(Color.TRANSPARENT);

        // 3. Extender el contenido de la app detrás de las barras del sistema
        window.getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
                        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        );
    }
}