# Relativistic Jet

The simulation models relativistic jets as narrow, high-speed outflows of plasma ejected from the regions near the black hole's poles. The jet's appearance is shaped by both the geometry of the Kerr black hole and relativistic effects.

## Jet Launch Region

The base of the jet is set at the event horizon radius at the pole:
```math
r_+ = 1 + \sqrt{1 - a^2}
```
where:
- $a$ is the dimensionless spin parameter ($0 \leq a < 1$).

The jet is aligned with the black hole's spin axis (the $y$-axis in the simulation).

## Jet Shape (Conical)

The jet radius increases linearly with distance from the event horizon pole:
```math
R_{\text{jet}}(y) = R_0 + \alpha (y - r_+)
```
where:
- $R_0$ is the base radius at the pole,
- $\alpha$ is the opening angle parameter,
- $y$ is the distance along the spin axis from the pole.

## Relativistic Beaming

The observed intensity of the jet is affected by relativistic beaming:
```math
I_{\text{obs}} = \frac{I_{\text{emit}}}{D^3}
```
where $D$ is the Doppler factor:
```math
D = \gamma (1 + \vec{n} \cdot \vec{v})
```
with
- $\gamma = 1/\sqrt{1 - v^2}$ (Lorentz factor),
- $\vec{n}$ is the direction from the jet material to the observer,
- $\vec{v}$ is the velocity of the jet material.

## Jet Fading

The jet intensity fades with distance from the base:
```math
I_{\text{jet}}(y) \propto (1 - t)
```
where $t = (y - r_+) / (L_{\text{jet}})$ and $L_{\text{jet}}$ is the jet length.
