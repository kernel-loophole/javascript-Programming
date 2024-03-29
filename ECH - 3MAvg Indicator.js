// --------- // SECTION 1. - LICENSE, COPYRIGHT, VERSION, AND CODE TYPE // ------------------ //
// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © Emergence Capital Holdings, LLC
//@version=5
indicator(title="ECH - Multi Moving Average - MTF", shorttitle="MTF - MMA", overlay=true)


///////////////////////////////////////////////////////////
// --- --- --- --- --- // MA1 SECTION // --- --- --- --- --- //
///////////////////////////////////////////////////////////

// --- --- --- --- --- // INPUTS // --- --- --- --- --- // 
var string GRPMMAvg0       = '═════════  MA 1 Settings  ═════════'
MMAvgTF = input.timeframe('', 'MA 1 Timeframe', group=GRPMMAvg0)

MMAvglen = input.int(9, minval=1, title="MA 1 Length", group=GRPMMAvg0)
MMAvgsrc = input(close, title="MA 1 Source", group=GRPMMAvg0)
MMAvgoffset = input.int(title="MA 1 Offset", defval=0, minval=-500, maxval=500, group=GRPMMAvg0)

typeMA = input.string("SMA"  , "MA 1 Type"     , options=["SMA", "EMA", "SMMA (RMA)", "WMA", "VWMA", 'LSMA', 'TMA', 'DEMA', 
     'TEMA', 'HMA', 'McGinley', 'Kijun v2', 'VAMA', 'EDSMA', 'MF', 'JMA'], group=GRPMMAvg0)
// smoothingLength = input.int(title = "3MAvg Length", defval = 5, minval = 1, maxval = 100, group='MMA')

//Kijun
var string GRPMMAvg1       = '═════════  MA 1 Kijun  ═════════'
Input_kidiv = input.int(defval=1, maxval=4, title='MA 1 Kijun MOD Divider', group=GRPMMAvg1)

//VAMA
var string GRPMMAvg2       = '═════════  MA 1 VAMA  ═════════'
Input_volatility_lookback = input.int(10, title='MA 1 * Volatility Adjusted (VAMA) Only - Volatility lookback length', group=GRPMMAvg2)

//EDSMA
var string GRPMMAvg3       = '═════════  MA 1 EDSMA  ═════════'
Input_edsma_ssfLength = input.int(title='MA 1 EDSMA - Super Smoother Filter Length', minval=1, defval=20, group=GRPMMAvg3)
Input_edsma_ssfPoles = input.int(title='MA 1 EDSMA - Super Smoother Filter Poles', defval=2, options=[2, 3], group=GRPMMAvg3)

//Modular Filter
var string GRPMMAvg4       = '═════════  MA 1 Modular Filter  ═════════'
Input_modular_filter_beta = input.float(0.8, minval=0, maxval=1, step=0.1, title='MA 1 Modular Filter, General Filter Only - Beta', group=GRPMMAvg4)
Input_modular_filter_feedback = input(false, title='MA 1 Modular Filter Only - Feedback', group=GRPMMAvg4)
Input_modular_filter_z = input.float(0.5, title='MA 1 Modular Filter Only - Feedback Weighting', step=0.1, minval=0, maxval=1, group=GRPMMAvg4)

//Jurik Moving Average
var string GRPMMAvg5       = '═════════  MA 1 JMA  ═════════'
Input_jurik_phase = input.int(title='MA 1 * Jurik (JMA) Only - Phase', defval=3, group=GRPMMAvg5)
Input_jurik_power = input.int(title='MA 1 * Jurik (JMA) Only - Power', defval=1, group=GRPMMAvg5)

// --- --- --- --- --- // FUNCTIONS // --- --- --- --- --- //
// --- --- --- --- // Function   EDSMA // --- --- --- --- //
get2PoleSSF(SOURCE, LENGTH) =>
    PI = 2 * math.asin(1)
    arg = math.sqrt(2) * PI / LENGTH
    a1 = math.exp(-arg)
    b1 = 2 * a1 * math.cos(arg)
    c2 = b1
    c3 = -math.pow(a1, 2)
    c1 = 1 - c2 - c3
    ssf = 0.0
    ssf := c1 * SOURCE + c2 * nz(ssf[1]) + c3 * nz(ssf[2])
    ssf
    
get3PoleSSF(SOURCE, LENGTH) =>
    PI = 2 * math.asin(1)
    arg = PI / LENGTH
    a1 = math.exp(-arg)
    b1 = 2 * a1 * math.cos(1.738 * arg)
    c1 = math.pow(a1, 2)
    coef2 = b1 + c1
    coef3 = -(c1 + b1 * c1)
    coef4 = math.pow(c1, 2)
    coef1 = 1 - coef2 - coef3 - coef4
    ssf = 0.0
    ssf := coef1 * SOURCE + coef2 * nz(ssf[1]) + coef3 * nz(ssf[2]) + coef4 * nz(ssf[3])
    ssf

// --- --- --- --- // Moving Average function // --- --- --- --- // 
ma(SOURCE, LENGTH, TYPE) =>
    float ema = ta.ema(SOURCE, LENGTH)
    float result = 0
    if TYPE == 'SMA'  // Simple
        result := ta.sma(SOURCE, LENGTH)
        result
    if TYPE == 'EMA'  // Exponential
        result := ema
        result
    if TYPE == "SMMA (RMA)" // RSI
        result := ta.rma(SOURCE, LENGTH)
        result
    if TYPE == 'WMA'  // Weighted
        result := ta.wma(SOURCE, LENGTH)
        result
    if TYPE == "VWMA" // Volume Weighted
        result := ta.vwma(SOURCE, LENGTH) 
        result
    if TYPE == 'LSMA' // Linear Regression Curve
        result := ta.linreg(SOURCE, LENGTH, 0)
        result
    if TYPE == 'TMA'
        result := ta.sma(ta.sma(SOURCE, math.ceil(LENGTH / 2)), math.floor(LENGTH / 2) + 1)
        result
    if TYPE == 'DEMA'  // Double Exponential
        result := 2 * ema - ema
        result
    if TYPE == 'TEMA'  // Triple Exponential
        result := 3 * (ema - ta.ema(ema, LENGTH)) + ta.ema(ta.ema(ema, LENGTH), LENGTH)
        result
    if TYPE == 'HMA'  // Hull
        result := ta.wma(2 * ta.wma(SOURCE, LENGTH / 2) - ta.wma(SOURCE, LENGTH), math.round(math.sqrt(LENGTH)))
        result
    if TYPE == 'McGinley'
        mg = 0.0
        mg := na(mg[1]) ? ema : mg[1] + (SOURCE - mg[1]) / (LENGTH * math.pow(SOURCE / mg[1], 4))
        result := mg
        result
    if TYPE == 'Kijun v2'
        kijun = math.avg(ta.lowest(LENGTH), ta.highest(LENGTH))  //, (open + close)/2)
        conversionLine = math.avg(ta.lowest(LENGTH / Input_kidiv), ta.highest(LENGTH / Input_kidiv))
        delta = (kijun + conversionLine) / 2
        result := delta
        result
    if TYPE == 'VAMA'  // Volatility Adjusted
        /// Copyright © 2019 to present, Joris Duyck (JD)
        mid = ema
        dev = SOURCE - mid
        vol_up = ta.highest(dev, Input_volatility_lookback)
        vol_down = ta.lowest(dev, Input_volatility_lookback)
        result := mid + math.avg(vol_up, vol_down)
        result
    if TYPE == 'EDSMA'
        zeros = SOURCE - nz(SOURCE[2])
        avgZeros = (zeros + zeros[1]) / 2
        // Ehlers Super Smoother Filter 
        ssf = Input_edsma_ssfPoles == 2 ? get2PoleSSF(avgZeros, Input_edsma_ssfLength) : get3PoleSSF(avgZeros, Input_edsma_ssfLength)
        // Rescale filter in terms of Standard Deviations
        stdev = ta.stdev(ssf, LENGTH)
        scaledFilter = stdev != 0 ? ssf / stdev : 0
        alpha = 5 * math.abs(scaledFilter) / LENGTH
        edsma = 0.0
        edsma := alpha * SOURCE + (1 - alpha) * nz(edsma[1])
        result := edsma
        result
    if TYPE == 'MF'
        ts = 0.
        b = 0.
        c = 0.
        os = 0.
        alpha = 2 / (LENGTH + 1)
        a = Input_modular_filter_feedback ? Input_modular_filter_z * SOURCE + (1 - Input_modular_filter_z) * nz(ts[1], SOURCE) : SOURCE
        b := a > alpha * a + (1 - alpha) * nz(b[1], a) ? a : alpha * a + (1 - alpha) * nz(b[1], a)
        c := a < alpha * a + (1 - alpha) * nz(c[1], a) ? a : alpha * a + (1 - alpha) * nz(c[1], a)
        os := a == b ? 1 : a == c ? 0 : os[1]
        upper = Input_modular_filter_beta * b + (1 - Input_modular_filter_beta) * c
        lower = Input_modular_filter_beta * c + (1 - Input_modular_filter_beta) * b
        ts := os * upper + (1 - os) * lower
        result := ts
        result
        
    if TYPE == 'JMA'  // Jurik
        /// Copyright © 2018 Alex Orekhov (everget)
        /// Copyright © 2017 Jurik Research and Consulting.
        phaseRatio = Input_jurik_phase < -100 ? 0.5 : Input_jurik_phase > 100 ? 2.5 : Input_jurik_phase / 100 + 1.5
        beta_ = 0.45 * (LENGTH - 1) / (0.45 * (LENGTH - 1) + 2)
        alpha = math.pow(beta_, Input_jurik_power)
        jma = 0.0
        e0 = 0.0
        e0 := (1 - alpha) * SOURCE + alpha * nz(e0[1])
        e1 = 0.0
        e1 := (SOURCE - e0) * (1 - beta_) + beta_ * nz(e1[1])
        e2 = 0.0
        e2 := (e0 + phaseRatio * e1 - nz(jma[1])) * math.pow(1 - alpha, 2) + math.pow(alpha, 2) * nz(e2[1])
        jma := e2 + nz(jma[1])
        result := jma
        result
    result

// --- --- --- --- --- // CALCULATIONS // --- --- --- --- --- //
[MMA1] = request.security('', MMAvgTF, [ma(MMAvgsrc, MMAvglen, typeMA)] , gaps=barmerge.gaps_off)
// MMA1 = ma(MMAvgsrc, MMAvglen, typeMA)

// --- --- --- --- --- // SIGNALS // --- --- --- --- --- //
MMAvgcrossUp = ta.crossover(MMA1, close)
MMAvgcrossDn = ta.crossunder(MMA1, close)

MMAvgtrendUp = close < MMA1// and close > EMAout
MMAvgtrendDn = close > MMA1// and close < EMAout

// --- --- --- --- --- // PLOTS // --- --- --- --- --- // 
// plotshape(MMAvgcrossUp, 'crossover' , style=shape.labeldown, text='CU', textcolor=color.white, location=location.abovebar)
// plotshape(MMAvgcrossDn, 'crossunder', style=shape.labelup  , text='CD', textcolor=color.white, location=location.belowbar)

// plotshape(MMAvgtrendUp, 'Trend up'  , style=shape.arrowup  , location=location.belowbar)
// plotshape(MMAvgtrendDn, 'Trend Down', style=shape.arrowdown, location=location.abovebar)

//plot(EMAout, title="EMA"  , color=color.blue, offset=EMAoffset)
// plot(close , title='Close', color=color.red)
plot(MMA1, title="3MAvg", color=color.yellow, offset=MMAvgoffset, linewidth=2)//, display=display.none)

///////////////////////////////////////////////////////////
// --- --- --- --- --- // MA2 SECTION // --- --- --- --- --- //
///////////////////////////////////////////////////////////
// --- --- --- --- --- // INPUTS // --- --- --- --- --- // 
var string GRPMMAvg6       = '═════════  MA 2 Settings  ═════════'
MMAvg_tf_use = input.bool(true, title='Use MA2?', group=GRPMMAvg6)
MMAvg_tf = input.timeframe('', 'MA 2 Timeframe', group=GRPMMAvg6)

MMAvglen_tf = input.int(9, minval=1, title="MA 2 MMA Length", group=GRPMMAvg6)
MMAvgsrc_tf = input(close, title="MA 2 MMA Source", group=GRPMMAvg6)
MMAvgoffset_tf = input.int(title="MA 2 Offset", defval=0, minval=-500, maxval=500, group=GRPMMAvg6)

typeMA_tf = input.string("SMA"  , "MA 2 Type"     , options=["SMA", "EMA", "SMMA (RMA)", "WMA", "VWMA", 'LSMA', 'TMA', 'DEMA', 
     'TEMA', 'HMA', 'McGinley', 'Kijun v2', 'VAMA', 'EDSMA', 'MF', 'JMA'], group=GRPMMAvg6)
// smoothingLength_tf = input.int(title = "3MAvg Length", defval = 5, minval = 1, maxval = 100, inline="Smoothing", group='EMA TF')

//Kijun
var string GRPMMAvg7       = '═════════  MA 2 Kijun  ═════════'
Input_kidiv_tf = input.int(defval=1, maxval=4, title='MA 2 Kijun MOD Divider', group=GRPMMAvg7)

//VAMA
var string GRPMMAvg8       = '═════════  MA 2 VAMA  ═════════'
Input_volatility_lookback_tf = input.int(10, title='MA 2 * Volatility Adjusted (VAMA) Only \n- Volatility lookback length', group=GRPMMAvg8)

//EDSMA
var string GRPMMAvg9       = '═════════  MA 2 EDSMA  ═════════'
Input_edsma_ssfLength_tf = input.int(title='MA 2 EDSMA - Super Smoother Filter Length', minval=1, defval=20, group=GRPMMAvg9)
Input_edsma_ssfPoles_tf = input.int(title='MA 2 EDSMA - Super Smoother Filter Poles', defval=2, options=[2, 3], group=GRPMMAvg9)

//Modular Filter
var string GRPMMAvg10       = '═════════  MA 2 Modular Filter  ═════════'
Input_modular_filter_beta_tf = input.float(0.8, minval=0, maxval=1, step=0.1, title='MA 2 Modular Filter, General Filter Only - Beta', group=GRPMMAvg10)
Input_modular_filter_feedback_tf = input(false, title='MA 2 Modular Filter Only - Feedback', group=GRPMMAvg10)
Input_modular_filter_z_tf = input.float(0.5, title='MA 2 Modular Filter Only - Feedback Weighting', step=0.1, minval=0, maxval=1, group=GRPMMAvg10)

//Jurik Moving Average
var string GRPMMAvg11       = '═════════  MA 2 JMA  ═════════'
Input_jurik_phase_tf = input.int(title='MA 2 * Jurik (JMA) Only - Phase', defval=3, group=GRPMMAvg11)
Input_jurik_power_tf = input.int(title='MA 2 * Jurik (JMA) Only - Power', defval=1, group=GRPMMAvg11)

// --- --- --- --- // Function   EDSMA // --- --- --- --- //
get2PoleSSF_tf(SOURCE_tf, LENGTH_tf) =>
    PI_tf = 2 * math.asin(1)
    arg_tf = math.sqrt(2) * PI_tf / LENGTH_tf
    a1_tf = math.exp(-arg_tf)
    b1_tf = 2 * a1_tf * math.cos(arg_tf)
    c2_tf = b1_tf
    c3_tf = -math.pow(a1_tf, 2)
    c1_tf = 1 - c2_tf - c3_tf
    ssf_tf = 0.0
    ssf_tf := c1_tf * SOURCE_tf + c2_tf * nz(ssf_tf[1]) + c3_tf * nz(ssf_tf[2])
    ssf_tf
    
get3PoleSSF_tf(SOURCE_tf, LENGTH_tf) =>
    PI_tf = 2 * math.asin(1)
    arg_tf = PI_tf / LENGTH_tf
    a1_tf = math.exp(-arg_tf)
    b1_tf = 2 * a1_tf * math.cos(1.738 * arg_tf)
    c1_tf = math.pow(a1_tf, 2)
    coef2_tf = b1_tf + c1_tf
    coef3_tf = -(c1_tf + b1_tf * c1_tf)
    coef4_tf = math.pow(c1_tf, 2)
    coef1_tf = 1 - coef2_tf - coef3_tf - coef4_tf
    ssf_tf = 0.0
    ssf_tf := coef1_tf * SOURCE_tf + coef2_tf * nz(ssf_tf[1]) + coef3_tf * nz(ssf_tf[2]) + coef4_tf * nz(ssf_tf[3])
    ssf_tf

// --- --- --- --- // Moving Average function // --- --- --- --- // 
ma_tf(SOURCE_tf, LENGTH_tf, TYPE) =>
    float ema_tf = ta.ema(SOURCE_tf, LENGTH_tf)
    float result = 0
    if TYPE == 'SMA'  // Simple
        result := ta.sma(SOURCE_tf, LENGTH_tf)
        result
    if TYPE == 'EMA'  // Exponential
        result := ema_tf
        result
    if TYPE == "SMMA (RMA)" // RSI
        result := ta.rma(SOURCE_tf, LENGTH_tf)
        result
    if TYPE == 'WMA'  // Weighted
        result := ta.wma(SOURCE_tf, LENGTH_tf)
        result
    if TYPE == "VWMA" // Volume Weighted
        result := ta.vwma(SOURCE_tf, LENGTH_tf) 
        result
    if TYPE == 'LSMA' // Linear Regression Curve
        result := ta.linreg(SOURCE_tf, LENGTH_tf, 0)
        result
    if TYPE == 'TMA'
        result := ta.sma(ta.sma(SOURCE_tf, math.ceil(LENGTH_tf / 2)), math.floor(LENGTH_tf / 2) + 1)
        result
    if TYPE == 'DEMA'  // Double Exponential
        result := 2 * ema_tf - ema_tf
        result
    if TYPE == 'TEMA'  // Triple Exponential
        result := 3 * (ema_tf - ta.ema(ema_tf, LENGTH_tf)) + ta.ema(ta.ema(ema_tf, LENGTH_tf), LENGTH_tf)
        result
    if TYPE == 'HMA'  // Hull
        result := ta.wma(2 * ta.wma(SOURCE_tf, LENGTH_tf / 2) - ta.wma(SOURCE_tf, LENGTH_tf), math.round(math.sqrt(LENGTH_tf)))
        result
    if TYPE == 'McGinley'
        mg_tf = 0.0
        mg_tf := na(mg_tf[1]) ? ema_tf : mg_tf[1] + (SOURCE_tf - mg_tf[1]) / (LENGTH_tf * math.pow(SOURCE_tf / mg_tf[1], 4))
        result := mg_tf
        result
    if TYPE == 'Kijun v2'
        kijun_tf = math.avg(ta.lowest(LENGTH_tf), ta.highest(LENGTH_tf))  //, (open + close)/2)
        conversionLine_tf = math.avg(ta.lowest(LENGTH_tf / Input_kidiv_tf), ta.highest(LENGTH_tf / Input_kidiv_tf))
        delta_tf = (kijun_tf + conversionLine_tf) / 2
        result := delta_tf
        result
    if TYPE == 'VAMA'  // Volatility Adjusted
        /// Copyright © 2019 to present, Joris Duyck (JD)
        mid_tf = ema_tf
        dev_tf = SOURCE_tf - mid_tf
        vol_up_tf = ta.highest(dev_tf, Input_volatility_lookback_tf)
        vol_down_tf = ta.lowest(dev_tf, Input_volatility_lookback_tf)
        result := mid_tf + math.avg(vol_up_tf, vol_down_tf)
        result
    if TYPE == 'EDSMA'
        zeros_tf = SOURCE_tf - nz(SOURCE_tf[2])
        avgZeros_tf = (zeros_tf + zeros_tf[1]) / 2
        // Ehlers Super Smoother Filter 
        ssf_tf = Input_edsma_ssfPoles_tf == 2 ? get2PoleSSF_tf(avgZeros_tf, Input_edsma_ssfLength_tf) : get3PoleSSF_tf(avgZeros_tf, Input_edsma_ssfLength_tf)
        // Rescale filter in terms of Standard Deviations
        stdev_tf = ta.stdev(ssf_tf, LENGTH_tf)
        scaledFilter_tf = stdev_tf != 0 ? ssf_tf / stdev_tf : 0
        alpha_tf = 5 * math.abs(scaledFilter_tf) / LENGTH_tf
        edsma_tf = 0.0
        edsma_tf := alpha_tf * SOURCE_tf + (1 - alpha_tf) * nz(edsma_tf[1])
        result := edsma_tf
        result
    if TYPE == 'MF'
        ts_tf = 0.
        b_tf = 0.
        c_tf = 0.
        os_tf = 0.
        alpha_tf = 2 / (LENGTH_tf + 1)
        a_tf = Input_modular_filter_feedback_tf ? Input_modular_filter_z_tf * SOURCE_tf + (1 - Input_modular_filter_z_tf) * nz(ts_tf[1], SOURCE_tf) : SOURCE_tf
        b_tf := a_tf > alpha_tf * a_tf + (1 - alpha_tf) * nz(b_tf[1], a_tf) ? a_tf : alpha_tf * a_tf + (1 - alpha_tf) * nz(b_tf[1], a_tf)
        c_tf := a_tf < alpha_tf * a_tf + (1 - alpha_tf) * nz(c_tf[1], a_tf) ? a_tf : alpha_tf * a_tf + (1 - alpha_tf) * nz(c_tf[1], a_tf)
        os_tf := a_tf == b_tf ? 1 : a_tf == c_tf ? 0 : os_tf[1]
        upper_tf = Input_modular_filter_beta_tf * b_tf + (1 - Input_modular_filter_beta_tf) * c_tf
        lower_tf = Input_modular_filter_beta_tf * c_tf + (1 - Input_modular_filter_beta_tf) * b_tf
        ts_tf := os_tf * upper_tf + (1 - os_tf) * lower_tf
        result := ts_tf
        result
        
    if TYPE == 'JMA'  // Jurik
        /// Copyright © 2018 Alex Orekhov (everget)
        /// Copyright © 2017 Jurik Research and Consulting.
        phaseRatio_tf = Input_jurik_phase_tf < -100 ? 0.5 : Input_jurik_phase_tf > 100 ? 2.5 : Input_jurik_phase_tf / 100 + 1.5
        beta_tf = 0.45 * (LENGTH_tf - 1) / (0.45 * (LENGTH_tf - 1) + 2)
        alpha_tf = math.pow(beta_tf, Input_jurik_power_tf)
        jma_tf = 0.0
        e0_tf = 0.0
        e0_tf := (1 - alpha_tf) * SOURCE_tf + alpha_tf * nz(e0_tf[1])
        e1_tf = 0.0
        e1_tf := (SOURCE_tf - e0_tf) * (1 - beta_tf) + beta_tf * nz(e1_tf[1])
        e2_tf = 0.0
        e2_tf := (e0_tf + phaseRatio_tf * e1_tf - nz(jma_tf[1])) * math.pow(1 - alpha_tf, 2) + math.pow(alpha_tf, 2) * nz(e2_tf[1])
        jma_tf := e2_tf + nz(jma_tf[1])
        result := jma_tf
        result
    result

// --- --- --- --- --- // CALCULATIONS // --- --- --- --- --- //
[MMA2] = request.security('', MMAvg_tf, [ma_tf(MMAvgsrc_tf, MMAvglen_tf, typeMA_tf)] , gaps=barmerge.gaps_off)

// --- --- --- --- --- // SIGNALS // --- --- --- --- --- //
MMAvgcrossUp_tf = MMAvg_tf_use ? ta.crossover(MMA2 , close) : ta.crossover(MMA1 , close)
MMAvgcrossDn_tf = MMAvg_tf_use ? ta.crossunder(MMA2, close) : ta.crossunder(MMA1, close)

MMAvgtrendUp_tf = MMAvg_tf_use ? close < MMA2 : close < MMA1
MMAvgtrendDn_tf = MMAvg_tf_use ? close > MMA2 : close > MMA1

MMAvg_long_entry  = MMAvg_tf_use ? ((MMA1 > MMA2) and (ta.crossover (close, MMA1))) : ta.crossover(close, MMA1)  
MMAvg_short_entry = MMAvg_tf_use ? ((MMA1 < MMA2) and (ta.crossunder(close, MMA1))) : ta.crossunder(close, MMA1) 

MMAvg_uptrend = MMAvg_tf_use ? ((MMA1 > MMA2) and (close > MMA1)) : close > MMA1 
MMAvg_dntrend = MMAvg_tf_use ? ((MMA1 < MMA2) and (close < MMA1)) : close < MMA1

// --- --- --- --- --- // PLOTS // --- --- --- --- --- // 
// plotshape(MMAvgcrossUp_tf, 'crossover' , style=shape.labeldown, text='CU', textcolor=color.white, location=location.abovebar, color=color.green)
// plotshape(MMAvgcrossDn_tf, 'crossunder', style=shape.labelup  , text='CD', textcolor=color.white, location=location.belowbar, color=color.red)

// plotshape(MMAvgtrendUp_tf, 'Trend up TF'  , style=shape.arrowup  , location=location.belowbar, color=color.green)
// plotshape(MMAvgtrendDn_tf, 'Trend Down TF', style=shape.arrowdown, location=location.abovebar, color=color.red)

plotshape(MMAvg_long_entry, 'Long Entry' , style=shape.labeldown, text='LE', textcolor=color.white, location=location.abovebar, color=color.lime)
plotshape(MMAvg_short_entry, 'Short Entry', style=shape.labelup  , text='SE', textcolor=color.white, location=location.belowbar, color=color.fuchsia)

plotshape(MMAvg_uptrend, 'Trend up TF'  , style=shape.arrowup  , location=location.belowbar, color=color.lime)
plotshape(MMAvg_dntrend, 'Trend Down TF', style=shape.arrowdown, location=location.abovebar, color=color.fuchsia)

//plot(EMAout_tf, title="EMA"  , color=color.orange, offset=EMAoffset_tf)
plot(MMAvg_tf_use ? MMA2 : na, title="3MAvg TF", color=color.new(color.yellow, 50), offset=MMAvgoffset_tf, linewidth=2)
