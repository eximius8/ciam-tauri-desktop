// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri_plugin_sql::{Migration, MigrationKind};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE ngdu (
                    id VARCHAR(36) PRIMARY KEY,
                    uid VARCHAR(36) NOT NULL,
                    baseId VARCHAR NOT NULL,
                    abbrev VARCHAR NOT NULL,
                    title VARCHAR NOT NULL
                );
                CREATE TABLE workshop (
                    id VARCHAR(36) PRIMARY KEY,
                    uuid VARCHAR(36),
                    baseId VARCHAR NOT NULL,
                    abbrev VARCHAR NOT NULL,
                    title VARCHAR NOT NULL,
                    extendedTitle VARCHAR NOT NULL,
                    ngduId VARCHAR NOT NULL,
                    FOREIGN KEY (ngduId) REFERENCES ngdu(id)
                );
                CREATE TABLE well (
                    id VARCHAR(36) PRIMARY KEY,
                    uuid VARCHAR(36),
                    baseId VARCHAR NOT NULL,
                    number VARCHAR NOT NULL,
                    workshopId VARCHAR NOT NULL,
                    FOREIGN KEY (workshopId) REFERENCES workshop(id)
                );
                -- Create measurements table
                CREATE TABLE measurements (
                    id CHAR(32) PRIMARY KEY,  -- For MD5 hash (32 hexadecimal characters)
                    creationdtm TEXT NOT NULL,  
                    source VARCHAR(256),
                    ngdu_id VARCHAR(36),
                    mtype VARCHAR(256),
                    operator VARCHAR(256),
                    bush VARCHAR(256),
                    type_hr VARCHAR(256),
                    workshop_id VARCHAR(36),
                    well_id VARCHAR(36),
                    mdt TEXT, 
                    meta TEXT,        -- JSON data
                    device_meta TEXT, -- JSON data
                    dataArray TEXT,   -- JSON data for array of measurements
                    
                    -- Foreign key constraints
                    FOREIGN KEY (ngdu_id) REFERENCES ngdu(id),
                    FOREIGN KEY (workshop_id) REFERENCES workshop(id),
                    FOREIGN KEY (well_id) REFERENCES well(id)
                );
                CREATE INDEX idx_measurements_ngdu ON measurements(ngdu_id);
                CREATE INDEX idx_measurements_workshop ON measurements(workshop_id);
                CREATE INDEX idx_measurements_well ON measurements(well_id);
                CREATE INDEX idx_measurements_mdt ON measurements(mdt);
                CREATE INDEX idx_measurements_type ON measurements(mtype);",
            kind: MigrationKind::Up,
        }
    ];
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:ciam.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
