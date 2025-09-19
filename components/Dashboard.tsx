import React, { useState, useEffect } from 'react';

type Status = 'normal' | 'warning' | 'critical';

interface SensorCardProps {
  name: string;
  value: string;
  unit: string;
  status: Status;
}

const SENSOR_CONFIG = {
    TIT: { name: 'Temp. Entrada Turbina', unit: '°C', base: 1070, range: 20, thresholds: { warn: 1085, crit: 1090 } },
    TAT: { name: 'Temp. Salida Turbina', unit: '°C', base: 535, range: 15, thresholds: { warn: 545, crit: 550 } },
    TEY: { name: 'Rendimiento Energético', unit: 'MW', base: 133, range: 3, thresholds: { warn: 130, crit: 128 } },
    CDP: { name: 'Presión Desc. Compresor', unit: 'mbar', base: 12, range: 2, thresholds: { warn: 13.5, crit: 14 } },
    CO: { name: 'Emisiones de CO', unit: 'mg/m³', base: 2.5, range: 2, thresholds: { warn: 4, crit: 5 } },
    NOX: { name: 'Emisiones de NOX', unit: 'mg/m³', base: 65, range: 15, thresholds: { warn: 75, crit: 80 } },
};

const getStatus = (value: number, { warn, crit }: { warn: number, crit: number }): Status => {
    const isDecreasingWarning = warn < crit;
    if (isDecreasingWarning) {
        if (value <= crit) return 'critical';
        if (value <= warn) return 'warning';
    } else {
        if (value >= crit) return 'critical';
        if (value >= warn) return 'warning';
    }
    return 'normal';
};

const SensorCard: React.FC<SensorCardProps> = ({ name, value, unit, status }) => {
  const statusClasses = {
    normal: 'border-green-500/50 bg-green-500/10 text-green-300',
    warning: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300',
    critical: 'border-red-500/50 bg-red-500/10 text-red-300 animate-pulse',
  };

  return (
    <div className={`p-4 rounded-lg border backdrop-blur-sm transition-all duration-300 ${statusClasses[status]}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-400 dark:text-gray-300">{name}</h3>
        <span className={`h-3 w-3 rounded-full ${status === 'normal' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
      </div>
      <p className="text-3xl font-bold font-roboto-mono text-gray-800 dark:text-white">
        {value} <span className="text-lg font-normal text-gray-500 dark:text-gray-400">{unit}</span>
      </p>
    </div>
  );
};


export const Dashboard: React.FC = () => {
    const [sensorData, setSensorData] = useState<Record<string, { value: number; status: Status }>>({});

    useEffect(() => {
        const updateData = () => {
            const newSensorData: Record<string, { value: number; status: Status }> = {};
            Object.entries(SENSOR_CONFIG).forEach(([key, config]) => {
                const randomFactor = (Math.random() - 0.5) * config.range;
                const currentValue = config.base + randomFactor;
                newSensorData[key] = {
                    value: currentValue,
                    status: getStatus(currentValue, config.thresholds)
                };
            });
            setSensorData(newSensorData);
        };

        updateData();
        const intervalId = setInterval(updateData, 3000); // Update every 3 seconds

        return () => clearInterval(intervalId);
    }, []);


  return (
    <div className="w-full h-full p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-blue-400/20 shadow-2xl backdrop-blur-xl overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Panel de Control en Tiempo Real</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {Object.entries(SENSOR_CONFIG).map(([key, config]) => (
                 <SensorCard
                    key={key}
                    name={config.name}
                    value={sensorData[key] ? sensorData[key].value.toFixed(2) : '...'}
                    unit={config.unit}
                    status={sensorData[key] ? sensorData[key].status : 'normal'}
                />
            ))}
        </div>
    </div>
  );
};
