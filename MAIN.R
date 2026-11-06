????# =========================================================================
# PROJECT ONE: GAMO/GOFA ZONE LANDSLIDE ANTECEDENT CONDITIONS ANALYSIS
# PHASE 6 (COLOR FIX): HIGH-CONTRAST RED-BLACK-YELLOW PRESENTATION MATRIX
# =========================================================================

# Step 1: Open the required visualization package
library(ggplot2)

# Step 2: Ingest the local CSV data file shared by Dagim
# This line pops up a window box so your mouse can select your downloaded spreadsheet file.
gofa_real_data <- read.csv(file.choose())

# Step 3: Map variables matching your uploaded file structure exactly
gofa_high_contrast_plot <- ggplot(gofa_real_data, aes(x = slope_deg, y = rainfall_mm, color = elevation_m, size = elevation_m)) +
  geom_point(alpha = 0.95) +
  geom_smooth(method = "lm", color = "#0000FF", se = TRUE, size = 1.2, inherit.aes = FALSE, aes(x = slope_deg, y = rainfall_mm)) +
  scale_color_gradientn(colors = c("black", "yellow", "red"), name = "Elevation Tiers (meters)") +
  scale_size_continuous(range = c(1.5, 4.5), name = "Topographic Scale (m)") +
  labs(
    title = "High-Contrast Gamo Zone Environmental Risk Matrix",
    subtitle = "Factual Plotting: Satellite Hillside Gradients vs. Accumulated Precipitation (March 2026)",
    x = "Hillside Slope Gradient (Degrees) — From SRTM Topography Sensor",
    y = "Accumulated Rain Saturation Volume (CHIRPS mm) — Extreme Storm Gauge"
  ) +
  theme_minimal() +
  theme(
    plot.title = element_text(face = "bold", size = 14, color = "#111111"),
    plot.subtitle = element_text(size = 11, color = "#333333"),
    axis.title = element_text(face = "bold", size = 11),
    legend.title = element_text(face = "bold", size = 10),
    legend.background = element_rect(fill = "#F8F9FA", color = "#BBBBBB")
  )

# Step 4: Draw the custom color graphic instantly onto your laptop layout panel
print(gofa_high_contrast_plot)

# Step 5: Save the high-contrast presentation asset directly to your drive folder
ggsave("gofa_high_contrast_hazard_plot.png", plot = gofa_high_contrast_plot, width = 8, height = 6, dpi = 300)

